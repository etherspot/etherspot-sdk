import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { NftList, OpenSeaAssets, OpenSeaHistory, Transaction, Transactions } from './classes';

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

  async getCollectibles(account: string): Promise<OpenSeaAssets> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: OpenSeaAssets;
    }>(
      gql`
        query($chainId: Int, $account: String!) {
          result: collectibles(chainId: $chainId, account: $account) {
            items {
              name
              tokenId
              description
              imageUrl
              imagePreviewUrl
              assetContract {
                name
                address
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
          result: OpenSeaAssets,
        },
      },
    );

    return result;
  }

  async getCollectiblesTransactionHistory(account: string): Promise<OpenSeaHistory> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: OpenSeaHistory;
    }>(
      gql`
        query($chainId: Int, $account: String!) {
          result: collectiblesTransactionHistory(chainId: $chainId, account: $account) {
            items {
              asset {
                name
                tokenId
                description
                imageUrl
                imagePreviewUrl
                assetContract {
                  name
                  address
                }
              }
              transaction {
                transactionHash
                blockNumber
                timestamp
                id
              }
              toAccount {
                address
              }
              fromAccount {
                address
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
          result: OpenSeaHistory,
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
          result: NftList(chainId: $chainId, account: $account) {
            items {
              contractName
              contractSymbol
              contractAddress
              tokenType
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
}
