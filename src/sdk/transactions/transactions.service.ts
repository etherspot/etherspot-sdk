import { gql } from '@apollo/client/core';
import { NetworkNames, networkNameToChainId } from '../network';
import { Service } from '../common';
import { NftList, Transaction, Transactions } from './classes';

export class TransactionsService extends Service {
  async getTransaction(hash: string, network?: NetworkNames): Promise<Transaction> {
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
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async getTransactions(account: string, network?: NetworkNames): Promise<Transactions> {
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
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async getNftList(account: string, network?: NetworkNames): Promise<NftList> {
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
              balance
              tokenType
              nftVersion
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
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }
}
