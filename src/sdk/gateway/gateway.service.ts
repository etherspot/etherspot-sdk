import { gql } from '@apollo/client/core';
import { utils } from 'ethers';
import { Exception, Service, TransactionRequest, UniqueSubject } from '../common';
import {
  GatewayEstimatedBatch,
  GatewayEstimatedKnownOp,
  GatewayGasInfo,
  GatewaySubmittedBatch,
  GatewaySubmittedBatches,
  GatewaySupportedToken,
  GatewaySupportedTokens,
  GatewayTransaction,
} from './classes';
import { GatewayKnownOps } from './constants';
import { GatewayBatch } from './interfaces';
import { uniqueNonce } from './utils';

export class GatewayService extends Service {
  readonly gatewayBatch$ = new UniqueSubject<GatewayBatch>(null);

  private estimationOptions: {
    nonce: number;
    feeToken: string;
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
    const { apiService, contractService } = this.services;

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
            feeToken
            feeAmount
            feeData
            delayedUntil
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

    if (result && result.logs) {
      result.events = contractService.processContractsLogs(result.logs);
    }

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
              feeToken
              feeAmount
              feeData
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

  async getGatewaySubmittedPendingBatches(page: number = null): Promise<GatewaySubmittedBatches> {
    const { accountService, apiService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: GatewaySubmittedBatches;
    }>(
      gql`
        query($chainId: Int, $account: String!, $page: Int) {
          result: gatewayPendingBatches(chainId: $chainId, account: $account, page: $page) {
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
              feeToken
              feeAmount
              feeData
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

  async getGatewayTransaction(hash: string): Promise<GatewayTransaction> {
    const { apiService, contractService } = this.services;

    const { result } = await apiService.query<{
      result: GatewayTransaction;
    }>(
      gql`
        query($chainId: Int, $hash: String!) {
          result: gatewayTransaction(chainId: $chainId, hash: $hash) {
            hash
            state
            sender
            gasPrice
            gasUsed
            totalCost
            createdAt
            updatedAt
            batches {
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
              feeToken
              feeAmount
              feeData
              createdAt
              updatedAt
            }
          }
        }
      `,
      {
        models: {
          result: GatewayTransaction,
        },
        variables: {
          hash,
        },
      },
    );

    if (result && result.batches && Array.isArray(result.batches)) {
      result.batches = result.batches.map((batch) => {
        if (batch.logs) {
          batch.events = contractService.processContractsLogs(batch.logs);
        }
        return batch;
      });
    }

    return result;
  }

  async getGatewayGasInfo(): Promise<GatewayGasInfo> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: GatewayGasInfo;
    }>(
      gql`
        query($chainId: Int) {
          result: gatewayGasInfo(chainId: $chainId) {
            standard
            fast
            instant
          }
        }
      `,
      {
        models: {
          result: GatewayGasInfo,
        },
      },
    );

    return result;
  }

  async estimateGatewayBatch(feeToken: string, statelessBatch?: GatewayBatch): Promise<GatewayBatch> {
    if (!this.gatewayBatch && !statelessBatch) {
      throw new Exception('Can not estimate empty batch');
    }

    const { to, data } = this.extractToAndData(statelessBatch);
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
          $feeToken: String
        ) {
          estimation: estimateGatewayBatch(
            chainId: $chainId
            account: $account
            nonce: $nonce
            to: $to
            data: $data
            feeToken: $feeToken
          ) {
            feeAmount
            feeTokenReceiver
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
          feeToken,
        },
      },
    );

    if (statelessBatch) {
      return {
        ...statelessBatch,
        estimation,
      };
    }

    this.estimationOptions = {
      nonce,
      feeToken,
    };

    this.gatewayBatch$.next({
      ...this.gatewayBatch,
      estimation,
    });

    return this.gatewayBatch;
  }

  async estimateGatewayKnownOp(op: GatewayKnownOps, feeToken: string = null): Promise<GatewayEstimatedKnownOp> {
    const { accountService, apiService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.mutate<{
      result: GatewayEstimatedKnownOp;
    }>(
      gql`
        mutation($chainId: Int, $account: String!, $op: GatewayKnownOps!, $feeToken: String) {
          result: estimateGatewayKnownOp(chainId: $chainId, account: $account, op: $op, feeToken: $feeToken) {
            feeAmount
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
          feeToken,
        },
      },
    );

    return result;
  }

  async submitGatewayBatch(statelessBatch?: GatewayBatch): Promise<GatewaySubmittedBatch> {
    if (!this.gatewayBatch && !statelessBatch) {
      throw new Exception('Can not submit empty batch');
    }

    const { estimation } = statelessBatch || this.gatewayBatch;

    if (!estimation || estimation.expiredAt.getTime() < estimation.createdAt.getTime()) {
      throw new Exception('Can not submit not estimated batch');
    }

    const { to, data } = this.extractToAndData(statelessBatch);
    const {
      feeTokenReceiver,
      feeAmount,
      estimatedGas,
      estimatedGasPrice,
      expiredAt: estimationExpiredAt,
      signature: estimationSignature,
    } = estimation;

    const { nonce, feeToken } = this.estimationOptions;

    const { accountService, walletService, apiService } = this.services;
    const { gatewayContract, personalAccountRegistryContract, erc20TokenContract } = this.internalContracts;

    const account = accountService.accountAddress;

    let feeTransactionRequest: TransactionRequest;

    if (feeToken) {
      const { data } = erc20TokenContract.encodeTransfer(feeTokenReceiver, feeAmount);

      feeTransactionRequest = personalAccountRegistryContract.encodeExecuteAccountTransaction(
        account,
        feeToken,
        0,
        data,
      );
    } else {
      feeTransactionRequest = personalAccountRegistryContract.encodeRefundAccountCall(account, null, feeAmount);
    }

    const messageHash = gatewayContract.hashDelegatedBatch(
      account,
      nonce,
      [...to, feeTransactionRequest.to],
      [...data, feeTransactionRequest.data],
    );
    const senderSignature = await walletService.signMessage(messageHash);

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
          $feeToken: String
          $feeAmount: BigNumber!
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
            feeToken: $feeToken
            feeAmount: $feeAmount
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
            feeToken
            feeAmount
            feeData
            delayedUntil
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
          feeToken,
          feeAmount,
          senderSignature,
          estimatedGas,
          estimatedGasPrice,
          estimationExpiredAt,
          estimationSignature,
        },
      },
    );

    if (!statelessBatch) {
      this.clearGatewayBatch();
    }

    return result;
  }

  async cancelGatewayBatch(hash: string): Promise<GatewaySubmittedBatch> {
    const { accountService, apiService } = this.services;

    const { accountAddress } = accountService;

    const { result } = await apiService.mutate<{
      result: GatewaySubmittedBatch;
    }>(
      gql`
        mutation($chainId: Int, $account: String!, $hash: String!) {
          result: cancelGatewayBatch(chainId: $chainId, account: $account, hash: $hash) {
            hash
            state
            account
            nonce
            to
            data
            senderSignature
            estimatedGas
            estimatedGasPrice
            feeToken
            feeAmount
            feeData
            delayedUntil
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
          account: accountAddress,
          hash,
        },
      },
    );

    return result;
  }

  async forceGatewayBatch(hash: string): Promise<GatewaySubmittedBatch> {
    const { accountService, apiService } = this.services;

    const { accountAddress } = accountService;

    const { result } = await apiService.mutate<{
      result: GatewaySubmittedBatch;
    }>(
      gql`
        mutation($chainId: Int, $account: String!, $hash: String!) {
          result: forceGatewayBatch(chainId: $chainId, account: $account, hash: $hash) {
            hash
            state
            account
            nonce
            to
            data
            senderSignature
            estimatedGas
            estimatedGasPrice
            feeToken
            feeAmount
            feeData
            delayedUntil
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
          account: accountAddress,
          hash,
        },
      },
    );

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

      const messageHash = gatewayContract.hashDelegatedBatch(account, nonce, to, data);
      const senderSignature = await walletService.signMessage(messageHash);

      result = gatewayContract.encodeDelegateBatch(account, nonce, to, data, senderSignature);
    } else {
      result = gatewayContract.encodeSendBatchFromAccount(account, to, data);
    }

    this.clearGatewayBatch();

    return result;
  }

  private extractToAndData(statelessBatch?: GatewayBatch): { to: string[]; data: string[] } {
    return (statelessBatch || this.gatewayBatch).requests.reduce(
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
