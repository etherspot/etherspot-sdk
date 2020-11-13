import { gql } from '@apollo/client/core';
import { utils } from 'ethers';
import { Exception, Service, TransactionRequest, UniqueSubject, uniqueNonce } from '../common';
import { GatewayEstimatedBatch, GatewaySubmittedBatch } from './classes';
import { GATEWAY_ESTIMATION_REFUND_PAYEE, GATEWAY_ESTIMATION_AMOUNT } from './constants';
import { GatewayBatch } from './interfaces';

export class GatewayService extends Service {
  readonly gatewayBatch$ = new UniqueSubject<GatewayBatch>(null);

  private estimationOptions: {
    nonce: number;
    refundToken: string;
  } = null;

  get gatewayBatch(): GatewayBatch {
    return this.gatewayBatch$.value;
  }

  batchGatewayTransactionRequest(transactionRequest: TransactionRequest): GatewayBatch {
    const { to, data } = transactionRequest;

    const gatewayBatch: GatewayBatch = {
      requests: [],
      ...(this.gatewayBatch || {}),
      estimation: null,
    };

    gatewayBatch.requests.push({
      to,
      data: utils.hexlify(data),
    });

    this.gatewayBatch$.next(gatewayBatch);

    return this.gatewayBatch;
  }

  clearGatewayBatch(): void {
    this.estimationOptions = null;

    this.gatewayBatch$.next(null);
  }

  async estimateGatewayBatch(refundToken: string): Promise<GatewayBatch> {
    if (!this.gatewayBatch) {
      throw new Exception('Can not estimate empty batch');
    }

    const { to, data } = this.extractToAndData();
    const nonce = uniqueNonce();

    const { accountService, walletService, apiService } = this.services;
    const { gatewayContract, personalAccountRegistryContract, erc20TokenContract } = this.contracts;

    const account = accountService.accountAddress;

    let refundTransactionRequest: TransactionRequest;

    if (refundToken) {
      const { to, data } = erc20TokenContract.encodeTransfer(
        refundToken,
        GATEWAY_ESTIMATION_REFUND_PAYEE,
        GATEWAY_ESTIMATION_AMOUNT,
      );

      refundTransactionRequest = personalAccountRegistryContract.encodeExecuteAccountTransaction(account, to, 0, data);
    } else {
      refundTransactionRequest = personalAccountRegistryContract.encodeRefundAccountCall(
        account,
        null,
        GATEWAY_ESTIMATION_AMOUNT,
      );
    }

    const typedMessage = gatewayContract.hashDelegatedBatch(
      nonce,
      [...to, refundTransactionRequest.to],
      [...data, refundTransactionRequest.data],
    );
    const senderSignature = await walletService.signTypedData(typedMessage);

    const { estimation } = await apiService.mutate<{
      estimation: GatewayEstimatedBatch;
    }>(
      gql`
        mutation(
          $chainId: Int
          $account: String!
          $nonce: Int!
          $to: [String!]!
          $data: [String!]!
          $refundToken: String
          $senderSignature: String!
        ) {
          estimation: estimateGatewayBatch(
            chainId: $chainId
            account: $account
            nonce: $nonce
            to: $to
            data: $data
            refundToken: $refundToken
            senderSignature: $senderSignature
          ) {
            refundAmount
            refundTokenPayee
            estimatedGas
            estimatedGasPrice
            signature
            createdAt
            expiredAt
          }
        }
      `,
      {
        models: {
          estimation: GatewayEstimatedBatch,
        },
        variables: {
          account,
          nonce,
          to,
          data,
          refundToken,
          senderSignature,
        },
      },
    );

    this.estimationOptions = {
      nonce,
      refundToken,
    };

    this.gatewayBatch$.next({
      ...this.gatewayBatch,
      estimation,
    });

    return this.gatewayBatch;
  }

  async submitGatewayBatch(): Promise<GatewaySubmittedBatch> {
    if (!this.gatewayBatch) {
      throw new Exception('Can not submit empty batch');
    }

    const { estimation } = this.gatewayBatch;

    if (!estimation || estimation.expiredAt.getTime() < estimation.createdAt.getTime()) {
      throw new Exception('Can not submit not estimated batch');
    }

    const { to, data } = this.extractToAndData();
    const {
      refundTokenPayee,
      refundAmount,
      estimatedGas,
      estimatedGasPrice,
      expiredAt: estimationExpiredAt,
      signature: estimationSignature,
    } = estimation;

    const { nonce, refundToken } = this.estimationOptions;

    const { accountService, walletService, apiService } = this.services;
    const { gatewayContract, personalAccountRegistryContract, erc20TokenContract } = this.contracts;

    const account = accountService.accountAddress;

    let refundTransactionRequest: TransactionRequest;

    if (refundToken) {
      const { to, data } = erc20TokenContract.encodeTransfer(refundToken, refundTokenPayee, refundAmount);

      refundTransactionRequest = personalAccountRegistryContract.encodeExecuteAccountTransaction(account, to, 0, data);
    } else {
      refundTransactionRequest = personalAccountRegistryContract.encodeRefundAccountCall(account, null, refundAmount);
    }

    const typedMessage = gatewayContract.hashDelegatedBatch(
      nonce,
      [...to, refundTransactionRequest.to],
      [...data, refundTransactionRequest.data],
    );
    const senderSignature = await walletService.signTypedData(typedMessage);

    const { result } = await apiService.mutate<{
      result: GatewaySubmittedBatch;
    }>(
      gql`
        mutation(
          $chainId: Int
          $account: String!
          $nonce: Int!
          $to: [String!]!
          $data: [String!]!
          $refundToken: String
          $refundAmount: BigNumber!
          $senderSignature: String!
          $estimatedGas: Int!
          $estimatedGasPrice: BigNumber!
          $estimationExpiredAt: DateTime!
          $estimationSignature: String!
        ) {
          result: submitGatewayBatch(
            chainId: $chainId
            account: $account
            nonce: $nonce
            to: $to
            data: $data
            refundToken: $refundToken
            refundAmount: $refundAmount
            senderSignature: $senderSignature
            estimatedGas: $estimatedGas
            estimatedGasPrice: $estimatedGasPrice
            estimationExpiredAt: $estimationExpiredAt
            estimationSignature: $estimationSignature
          ) {
            transaction {
              hash
              state
              sender
              gasPrice
              estimatedGas
              estimatedCost
              createdAt
              updatedAt
            }
            hash
            state
            account
            nonce
            to
            data
            senderSignature
            estimatedGas
            estimatedGasPrice
            refundToken
            refundAmount
            refundData
            createdAt
            updatedAt
          }
        }
      `,
      {
        models: {
          result: GatewaySubmittedBatch,
        },
        variables: {
          account,
          nonce,
          to,
          data,
          refundToken,
          refundAmount,
          senderSignature,
          estimatedGas,
          estimatedGasPrice,
          estimationExpiredAt,
          estimationSignature,
        },
      },
    );

    this.clearGatewayBatch();

    return result;
  }

  async encodeGatewayBatch(delegate: boolean): Promise<TransactionRequest> {
    if (!this.gatewayBatch) {
      throw new Exception('Can not encode empty batch');
    }

    let result: TransactionRequest;

    const { accountService, walletService } = this.services;
    const { gatewayContract } = this.contracts;

    const account = accountService.accountAddress;

    const { to, data } = this.extractToAndData();

    if (delegate) {
      const nonce = uniqueNonce();

      const typedMessage = gatewayContract.hashDelegatedBatch(nonce, to, data);
      const senderSignature = await walletService.signTypedData(typedMessage);

      result = gatewayContract.encodeDelegateBatch(account, nonce, to, data, senderSignature);
    } else {
      result = gatewayContract.encodeSendBatchFromAccount(account, to, data);
    }

    this.clearGatewayBatch();

    return result;
  }

  private extractToAndData(): { to: string[]; data: string[] } {
    return this.gatewayBatch.requests.reduce(
      (result, { to, data }) => {
        result.to.push(to);
        result.data.push(data);
        return result;
      },
      {
        to: [],
        data: [],
      },
    );
  }
}
