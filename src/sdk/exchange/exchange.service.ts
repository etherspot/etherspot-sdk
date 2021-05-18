import { BigNumber } from 'ethers';
import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { ExchangeOffers, ExchangeOffer } from './classes';
import { TokenListToken, TokenListTokens } from '../assets';

export class ExchangeService extends Service {
  async getExchangeSupportedAssets(): Promise<TokenListToken[]> {
    const { apiService, accountService } = this.services;

    const account = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: TokenListTokens;
    }>(
      gql`
        query($chainId: Int, $account: String!) {
          result: exchangeSupportedAssets(chainId: $chainId, account: $account) {
            items {
              address
              name
              symbol
              decimals
              logoURI
            }
          }
        }
      `,
      {
        variables: {
          account,
        },
        models: {
          result: TokenListTokens,
        },
      },
    );

    return result ? result.items : null;
  }

  async getExchangeOffers(
    fromTokenAddress: string,
    toTokenAddress: string,
    fromAmount: BigNumber,
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
      },
    );

    return result ? result.items : null;
  }
}
