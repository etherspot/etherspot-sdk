import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { NftList, Transaction, Transactions } from './classes';

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
}
