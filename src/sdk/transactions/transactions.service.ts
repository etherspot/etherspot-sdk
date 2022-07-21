import { gql } from '@apollo/client/core';
import { BigNumber } from 'ethers';
import { Service } from '../common';
import { NftList, StreamTransactionPayload, Transaction, Transactions } from './classes';

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
    ): Promise<StreamTransactionPayload> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: StreamTransactionPayload;
    }>(
      gql`
        query($account: String!, $receiver: String!, $amount: BigNumber!, $tokenAddress: String!, $chainId: Int!) {
          result: streamTransactionPayload(account: $account, receiver: $receiver, amount: $amount, tokenAddress: $tokenAddress, chainId: $chainId) {
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
          tokenAddress
        },
        models: {
          result: StreamTransactionPayload,
        },
      },
    );
    return result;
  }

  async createSuperERC20Wrapper(
    underlyingToken: string,
    underlyingDecimals: number,
    name: string,
    symbol: string
  ): Promise<string | null> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: string;
    }>(
      gql`
        query($chainId: Int!, $underlyingToken: String!, $underlyingDecimals: Int!, $name: String!, $symbol: String!) {
          result: createSuperERC20Wrapper(
            chainId: $chainId,
            underlyingToken: $underlyingToken,
            underlyingDecimals: $underlyingDecimals,
            name: $name,
            symbol: $symbol
          )
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
      },
    );
    return result;
  }
}
