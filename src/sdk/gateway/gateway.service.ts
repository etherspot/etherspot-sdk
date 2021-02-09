import { gql } from '@apollo/client/core';
import { utils } from 'ethers';
import { Exception, Service, TransactionRequest, UniqueSubject } from '../common';
import {
  GatewayEstimatedBatch,
  GatewayEstimatedKnownOp,
  GatewaySubmittedBatch,
  GatewaySubmittedBatches,
  GatewaySupportedToken,
  GatewaySupportedTokens,
} from './classes';
import { GatewayKnownOps } from './constants';
import { GatewayBatch } from './interfaces';
import { uniqueNonce } from './utils';

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

  async getGatewaySupportedToken(token: string): Promise<GatewaySupportedToken> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: GatewaySupportedToken;
    }>(
      gql`
        query($chainId: Int, $token: String!) {
          result: gatewaySupportedToken(chainId: $chainId, token: $token) {
            address
            exchangeRate
          }
        }
      `,
      {
        models: {
          result: GatewaySupportedToken,
        },
        variables: {
          token,
        },
      },
    );

    return result;
  }

  async getGatewaySupportedTokens(): Promise<GatewaySupportedToken[]> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: GatewaySupportedTokens;
    }>(
      gql`
        query($chainId: Int) {
          result: gatewaySupportedTokens(chainId: $chainId) {
            items {
              address
              exchangeRate
            }
          }
        }
      `,
      {
        models: {
          result: GatewaySupportedTokens,
        },
      },
    );

    return result.items;
  }

  async getGatewaySubmittedBatch(hash: string): Promise<GatewaySubmittedBatch> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: GatewaySubmittedBatch;
    }>(
      gql`
        query($chainId: Int, $hash: String!) {
          result: gatewayBatch(chainId: $chainId, hash: $hash) {
            transaction {
              hash
              state
              sender
              gasPrice
              gasUsed
              totalCost
              createdAt
              updatedAt
            }
            logs {
              address
              data
              topics
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
          hash,
        },
      },
    );

    return result;
  }

  async getGatewaySubmittedBatches(page: number = null): Promise<GatewaySubmittedBatches> {
    const { accountService, apiService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: GatewaySubmittedBatches;
    }>(
      gql`
        query($chainId: Int, $account: String!, $page: Int) {
          result: gatewayBatches(chainId: $chainId, account: $account, page: $page) {
            items {
              transaction {
                hash
                state
                sender
                gasPrice
                gasUsed
                totalCost
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
            currentPage
            nextPage
          }
        }
      `,
      {
        models: {
          result: GatewaySubmittedBatches,
        },
        variables: {
          account,
          page: page || 1,
        },
      },
    );

    return result;
  }

  async estimateGatewayBatch(refundToken: string): Promise<GatewayBatch> {
    if (!this.gatewayBatch) {
      throw new Exception('Can not estimate empty batch');
    }

    const { to, data } = this.extractToAndData();
    const nonce = uniqueNonce();

    const { accountService, apiService } = this.services;

    const account = accountService.accountAddress;

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
        ) {
          estimation: estimateGatewayBatch(
            chainId: $chainId
            account: $account
            nonce: $nonce
            to: $to
            data: $data
            refundToken: $refundToken
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

  async estimateGatewayKnownOp(op: GatewayKnownOps, refundToken: string = null): Promise<GatewayEstimatedKnownOp> {
    const { accountService, apiService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.mutate<{
      result: GatewayEstimatedKnownOp;
    }>(
      gql`
        mutation($chainId: Int, $account: String!, $op: GatewayKnownOps!, $refundToken: String) {
          result: estimateGatewayKnownOp(chainId: $chainId, account: $account, op: $op, refundToken: $refundToken) {
            refundAmount
            estimatedGas
            estimatedGasPrice
          }
        }
      `,
      {
        models: {
          result: GatewayEstimatedKnownOp,
        },
        variables: {
          account,
          op,
          refundToken,
        },
      },
    );

    return result;
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
    const { gatewayContract, personalAccountRegistryContract, erc20TokenContract } = this.internalContracts;

    const account = accountService.accountAddress;

    let refundTransactionRequest: TransactionRequest;

    if (refundToken) {
      const { data } = erc20TokenContract.encodeTransfer(refundTokenPayee, refundAmount);

      refundTransactionRequest = personalAccountRegistryContract.encodeExecuteAccountTransaction(
        account,
        refundToken,
        0,
        data,
      );
    } else {
      refundTransactionRequest = personalAccountRegistryContract.encodeRefundAccountCall(account, null, refundAmount);
    }

    const typedMessage = gatewayContract.buildDelegatedBatchTypedData(
      account,
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
              gasUsed
              totalCost
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
    const { gatewayContract } = this.internalContracts;

    const account = accountService.accountAddress;

    const { to, data } = this.extractToAndData();

    if (delegate) {
      const nonce = uniqueNonce();

      const typedMessage = gatewayContract.buildDelegatedBatchTypedData(account, nonce, to, data);
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
