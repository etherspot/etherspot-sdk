import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { RateData } from './classes';

export class RatesService extends Service {
  async fetchExchangeRates(tokens: string[], chainId: number): Promise<RateData> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: RateData;
    }>(
      gql`
        query($tokens: [String!]!, $chainId: Int!) {
          result: fetchExchangeRates(tokens: $tokens, chainId: $chainId) {
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
          chainId,
        },
        models: {
          result: RateData,
        },
      },
    );

    return result;
  }
}
