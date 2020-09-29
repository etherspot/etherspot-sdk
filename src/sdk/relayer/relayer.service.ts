import { gql } from '@apollo/client/core';
import { BigNumber } from 'ethers';
import { Service } from '../common';
import { EstimatedRelayedTransaction, RelayedAccount, RelayedTransaction, RelayedTransactions } from './classes';

export class RelayerService extends Service {
  async estimatedRelayedTransaction(
    to: string[],
    data: string[],
    refundToken: string,
  ): Promise<EstimatedRelayedTransaction> {
    const { accountService, walletService, apiService } = this.services;

    const account = accountService.accountAddress;
    const sender = walletService.address;

    const { result } = await apiService.mutate<{
      result: EstimatedRelayedTransaction;
    }>(
      gql`
        mutation(
          $chainId: Int
          $account: String!
          $sender: String!
          $to: [String!]!
          $data: [String!]!
          $refundToken: String
        ) {
          result: estimateRelayedTransaction(
            chainId: $chainId
            account: $account
            sender: $sender
            to: $to
            data: $data
            refundToken: $refundToken
          ) {
            gasLimit
            gasPrice
            totalCost
            refundToken
            refundAmount
          }
        }
      `,
      {
        models: {
          result: EstimatedRelayedTransaction,
        },
        variables: {
          account,
          sender,
          to,
          data,
          refundToken,
        },
      },
    );

    return result;
  }

  async sendRelayedTransaction(to: string[], data: string[], gasPrice: BigNumber): Promise<RelayedTransaction> {
    const { gatewayContract } = this.contracts;
    const { accountService, walletService, apiService } = this.services;

    const account = accountService.accountAddress;
    const { nonce } = await this.getRelayedAccount(accountService.accountAddress);

    const typedMessage = gatewayContract.buildTypedData(
      'DelegatedBatch',
      [
        { name: 'nonce', type: 'uint256' }, //
        { name: 'to', type: 'address[]' },
        { name: 'data', type: 'bytes[]' },
        { name: 'gasPrice', type: 'uint256' },
      ],
      {
        nonce: nonce.toHexString(), //
        to,
        data,
        gasPrice: gasPrice.toHexString(),
      },
    );

    const senderSignature = await walletService.signTypedData(typedMessage);

    const { result } = await apiService.mutate<{
      result: RelayedTransaction;
    }>(
      gql`
        mutation(
          $chainId: Int
          $account: String!
          $to: [String!]!
          $data: [String!]!
          $gasPrice: BigNumber!
          $senderSignature: String!
        ) {
          result: sendRelayedTransaction(
            chainId: $chainId
            account: $account
            to: $to
            data: $data
            gasPrice: $gasPrice
            senderSignature: $senderSignature
          ) {
            account
            createdAt
            encodedData
            gasLimit
            gasPrice
            hash
            key
            refundAmount
            refundToken
            sender
            state
            updatedAt
          }
        }
      `,
      {
        models: {
          result: RelayedTransaction,
        },
        variables: {
          account,
          to,
          data,
          gasPrice: gasPrice.toHexString(),
          senderSignature,
        },
      },
    );

    return result;
  }

  async getRelayedTransaction(key: string): Promise<RelayedTransaction> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: RelayedTransaction;
    }>(
      gql`
        query($chainId: Int, $key: String!) {
          result: relayedTransaction(chainId: $chainId, key: $key) {
            account
            createdAt
            encodedData
            gasLimit
            gasPrice
            hash
            key
            refundAmount
            refundToken
            sender
            state
            updatedAt
          }
        }
      `,
      {
        models: {
          result: RelayedTransaction,
        },
        variables: {
          key,
        },
      },
    );

    return result;
  }

  async getRelayedTransactions(account: string, page: number = null): Promise<RelayedTransactions> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: RelayedTransactions;
    }>(
      gql`
        query($chainId: Int, $account: String!, $page: Int) {
          result: relayedTransactions(chainId: $chainId, account: $account, page: $page) {
            items {
              account
              createdAt
              encodedData
              gasLimit
              gasPrice
              hash
              key
              refundAmount
              refundToken
              sender
              state
              updatedAt
            }
            currentPage
            nextPage
          }
        }
      `,
      {
        models: {
          result: RelayedTransactions,
        },
        variables: {
          account,
          page: page || 1,
        },
      },
    );

    return result;
  }

  private async getRelayedAccount(address: string): Promise<RelayedAccount> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: RelayedAccount;
    }>(
      gql`
        query($chainId: Int, $address: String!) {
          result: relayedAccount(chainId: $chainId, address: $address) {
            address
            nonce
          }
        }
      `,
      {
        models: {
          result: RelayedAccount,
        },
        variables: {
          address,
        },
      },
    );

    return result;
  }
}
