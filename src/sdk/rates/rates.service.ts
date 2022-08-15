import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { Rates } from './classes';

export class RatesService extends Service {
  async fetchExchangeRates(tokenList: string[], chainId: number): Promise<Rates> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: Rates;
    }>(
      gql`
        query(
          $tokenList: String[]
          $chainId: Int
        ) {
          result: fetchExchangeRates(
            tokenList: $tokenList
            chainId: $chainId
            
          ) {
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
          tokenList,
          chainId,
        },
        models: {
          result: Rates,
        },
      },
    );

    return result ? result : null;
  }
}
