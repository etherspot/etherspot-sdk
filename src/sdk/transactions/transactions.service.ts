import { gql } from '@apollo/client/core';
import { BigNumber } from 'ethers';
import { Service } from '../common';
import { NftList, StreamList, StreamTransactionPayload, Transaction, Transactions } from './classes';

export class TransactionsService extends Service {
  async getTransaction(hash: string): Promise<Transaction> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: Transaction;
    }>(
      gql`
        query($chainId: Int, $hash: String!) {
          result: transaction(chainId: $chainId, hash: $hash) {
            blockHash
            blockNumber
            from
            gasLimit
            gasPrice
            gasUsed
            hash
            input
            logs
            nonce
            status
            timestamp
            to
            transactionIndex
            value
            blockExplorerUrl
            mainTransactionDataFetched
            internalTransactionsFetched
          }
        }
      `,
      {
        variables: {
          hash,
        },
        models: {
          result: Transaction,
        },
      },
    );

    return result;
  }

  async getTransactions(account: string): Promise<Transactions> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: Transactions;
    }>(
      gql`
        query($chainId: Int, $account: String!) {
          result: transactions(chainId: $chainId, account: $account) {
            items {
              blockNumber
              timestamp
              from
              gasLimit
              gasPrice
              gasUsed
              hash
              logs
              status
              to
              value
              direction
              internalTransactions
              internalTransactionsFetched
              mainTransactionDataFetched
              batch
              asset {
                from
                to
                name
                symbol
                category
                type
                value
                decimal
                contract
              }
              blockExplorerUrl
            }
          }
        }
      `,
      {
        variables: {
          account,
        },
        models: {
          result: Transactions,
        },
      },
    );

    return result;
  }

  async getNftList(account: string): Promise<NftList> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: NftList;
    }>(
      gql`
        query($chainId: Int, $account: String!) {
          result: nftList(chainId: $chainId, account: $account) {
            items {
              contractName
              contractSymbol
              contractAddress
              tokenType
              nftVersion
              nftDescription
              balance
              items {
                tokenId
                name
                amount
                image
              }
            }
          }
        }
      `,
      {
        variables: {
          account,
        },
        models: {
          result: NftList,
        },
      },
    );

    return result;
  }

  async createStreamTransactionPayload(
    account: string,
    receiver: string,
    amount: BigNumber,
    tokenAddress: string,
    userData: string,
    skipBalanceCheck: boolean
  ): Promise<StreamTransactionPayload> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: StreamTransactionPayload;
    }>(
      gql`
        query($account: String!, $receiver: String!, $amount: BigNumber!, $tokenAddress: String!, $chainId: Int!, $userData: String, $skipBalanceCheck: Boolean) {
          result: streamTransactionPayload(
            account: $account, receiver: $receiver, amount: $amount, tokenAddress: $tokenAddress, chainId: $chainId, userData: $userData, skipBalanceCheck: $skipBalanceCheck
          ) {
            data
            to
            error
          }
        }
      `,
      {
        variables: {
          account,
          receiver,
          amount,
          tokenAddress,
          userData,
          skipBalanceCheck,
        },
        models: {
          result: StreamTransactionPayload,
        },
      },
    );
    return result;
  }

  async modifyStreamTransactionPayload(
    account: string,
    receiver: string,
    amount: BigNumber,
    tokenAddress: string,
    userData?: string,
    skipBalanceCheck?: boolean,
  ): Promise<StreamTransactionPayload> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: StreamTransactionPayload;
    }>(
      gql`
        query($account: String!, $receiver: String!, $amount: BigNumber!, $tokenAddress: String!, $chainId: Int!, $userData: String, $skipBalanceCheck: Boolean) {
          result: modifyTransactionPayload(
            account: $account, receiver: $receiver, amount: $amount, tokenAddress: $tokenAddress, chainId: $chainId, userData: $userData, skipBalanceCheck: $skipBalanceCheck
          ) {
            data
            to
            error
          }
        }
      `,
      {
        variables: {
          account,
          receiver,
          amount,
          tokenAddress,
          userData,
          skipBalanceCheck,
        },
        models: {
          result: StreamTransactionPayload,
        },
      },
    );
    return result;
  }

  async deleteStreamTransactionPayload(
    account: string,
    receiver: string,
    tokenAddress: string,
    userData: string,
  ): Promise<StreamTransactionPayload> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: StreamTransactionPayload;
    }>(
      gql`
        query($account: String!, $receiver: String!, $tokenAddress: String!, $chainId: Int!, $userData: String) {
          result: deleteTransactionPayload(account: $account, receiver: $receiver, tokenAddress: $tokenAddress, chainId: $chainId, userData: $userData) {
            data
            to
            error
          }
        }
      `,
      {
        variables: {
          account,
          receiver,
          tokenAddress,
          userData,
        },
        models: {
          result: StreamTransactionPayload,
        },
      },
    );
    return result;
  }

  async getStreamList(
    account: string,
  ): Promise<StreamList> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: StreamList;
    }>(
      gql`
        query($account: String!, $chainId: Int!) {
          result: streamList(account: $account, chainId: $chainId) {
            items {
              id
              createdAtTimestamp
              createdAtBlockNumber
              updatedAtTimestamp
              updatedAtBlockNumber
              currentFlowRate
              streamedUntilUpdatedAt
              token {
                id
                createdAtTimestamp
                createdAtBlockNumber
                name
                symbol
                isListed
                underlyingAddress
              }
              sender
              receiver
              flowUpdatedEvents {
                id
                blockNumber
                timestamp
                transactionHash
                token
                sender
                receiver
                flowRate
                totalSenderFlowRate
                totalReceiverFlowRate
                userData
                oldFlowRate
                type
                totalAmountStreamedUntilTimestamp
              }
            }
            error
          }
        }
      `,
      {
        variables: {
          account,
        },
        models: {
          result: StreamList,
        },
      },
    );
    return result;
  }

  async createSuperERC20WrapperTransactionPayload(
    underlyingToken: string,
    underlyingDecimals: number,
    name: string,
    symbol: string
  ): Promise<StreamTransactionPayload> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: StreamTransactionPayload;
    }>(
      gql`
        query($chainId: Int!, $underlyingToken: String!, $underlyingDecimals: Int, $name: String, $symbol: String) {
          result: createSuperERC20WrapperTransactionPayload(
            chainId: $chainId,
            underlyingToken: $underlyingToken,
            underlyingDecimals: $underlyingDecimals,
            name: $name,
            symbol: $symbol
          ) {
            error,
            data,
            to
          }
        }
      `,
      {
        variables: {
          chainId: this.services.networkService.chainId,
          underlyingToken,
          underlyingDecimals,
          name,
          symbol,
        },
        models: {
          result: StreamTransactionPayload,
        },
      },
    );
    return result;
  }
}
