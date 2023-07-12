import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { RateData } from './classes';

export class RatesService extends Service {
  async fetchExchangeRates(tokens: string[], ChainId: number): Promise<RateData> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: RateData;
    }>(
      gql`
        query($tokens: [String!]!, $ChainId: Int!) {
          result: fetchExchangeRates(tokens: $tokens, chainId: $ChainId) {
            errored
            error
            items {
              address
              eth
              eur
              gbp
              usd
            }
          }
        }
      `,
      {
        variables: {
          tokens,
          ChainId,
        },
        models: {
          result: RateData,
        },
      },
    );

    return result;
  }
}
