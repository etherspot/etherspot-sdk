import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { RateData } from './classes';

export class RatesService extends Service {
  async fetchExchangeRates(tokenList: string[], chainId: number): Promise<RateData> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: RateData;
    }>(
      gql`
        query($tokenList: [String!]!, $chainId: Int!) {
          result: fetchExchangeRates(tokenList: $tokenList, chainId: $chainId) {
            errored
            error
            results {
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
          tokenList,
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
