import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { NameResolutionsNodes } from './classes';

export class NameResolutionService extends Service {
  async resolveName(chainId: number, name: string): Promise<NameResolutionsNodes> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: NameResolutionsNodes;
    }>(
      gql`
        query($chainId: Int, $name: String!) {
          result: resolveName(chainId: $chainId, name: $name) {
            results {
              ens {
                address
                hash
                name
                label
                state
                zone
              }
              unstoppabledomains {
                address
                hash
                name
                label
                state
                zone
              }
              fio {
                address
                hash
                name
                label
                state
                zone
                fioChainCode
                fioTokenCode
              }
            }
            message
            failed
          }
        }
      `,
      {
        variables: {
          chainId,
          name,
        },
        models: {
          result: NameResolutionsNodes,
        },
      },
    );

    return result;
  }
}
