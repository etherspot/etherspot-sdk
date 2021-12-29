import { BigNumber } from 'ethers';
import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { ExchangeOffers, ExchangeOffer } from './classes';
import { PaginatedTokens } from '../assets';
import { NetworkNames, networkNameToChainId } from '../network';

export class ExchangeService extends Service {
  async getExchangeSupportedAssets(
    page: number = null,
    limit: number = null,
    network?: NetworkNames,
  ): Promise<PaginatedTokens> {
    const { apiService, accountService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: PaginatedTokens;
    }>(
      gql`
        query($chainId: Int, $account: String!, $page: Int, $limit: Int) {
          result: exchangeSupportedAssets(chainId: $chainId, account: $account, page: $page, limit: $limit) {
            items {
              address
              name
              symbol
              decimals
              logoURI
            }
            currentPage
            nextPage
          }
        }
      `,
      {
        variables: {
          account,
          page: page || 1,
          limit: limit || 100,
        },
        models: {
          result: PaginatedTokens,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async getExchangeOffers(
    fromTokenAddress: string,
    toTokenAddress: string,
    fromAmount: BigNumber,
    network?: NetworkNames,
  ): Promise<ExchangeOffer[]> {
    const { apiService, accountService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: ExchangeOffers;
    }>(
      gql`
        query(
          $chainId: Int
          $account: String!
          $fromTokenAddress: String!
          $toTokenAddress: String!
          $fromAmount: BigNumber!
        ) {
          result: exchangeOffers(
            chainId: $chainId
            account: $account
            fromTokenAddress: $fromTokenAddress
            toTokenAddress: $toTokenAddress
            fromAmount: $fromAmount
          ) {
            items {
              provider
              receiveAmount
              exchangeRate
              transactions {
                to
                data
                value
              }
            }
          }
        }
      `,
      {
        variables: {
          account,
          fromTokenAddress,
          toTokenAddress,
          fromAmount,
        },
        models: {
          result: ExchangeOffers,
        },
        chainId: networkNameToChainId(network),
      },
    );

    return result ? result.items : null;
  }
}
