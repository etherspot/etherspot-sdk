import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { Transaction, Transactions } from './classes';

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
            cumulativeGasUsed
            from
            gasLimit
            gasPrice
            gasUsed
            hash
            input
            logs
            logsBloom
            nonce
            status
            to
            transactionIndex
            value
            asset {
              name
              category
              value
              decimal
              contract
            }
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
              blockHash
              blockNumber
              cumulativeGasUsed
              from
              gasLimit
              gasPrice
              gasUsed
              hash
              input
              logs
              logsBloom
              nonce
              status
              to
              transactionIndex
              value
              asset {
                name
                category
                value
                decimal
                contract
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
          result: Transactions,
        },
      },
    );

    return result;
  }
}
