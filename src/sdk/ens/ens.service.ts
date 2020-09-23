import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { ENSNode } from './classes';

export class ENSService extends Service {
  async createENSSubNode(name: string): Promise<ENSNode> {
    const { apiService, accountService } = this.services;

    const address = accountService.accountAddress;

    const { result } = await apiService.mutate<{
      result: ENSNode;
    }>(
      gql`
        mutation($chainId: Int, $address: String!, $name: String!) {
          result: createENSSubNode(chainId: $chainId, address: $address, name: $name) {
            hash
            name
            address
            label
            type
            state
            guardianSignature
            createdAt
            updatedAt
          }
        }
      `,
      {
        variables: {
          name,
          address,
        },
        models: {
          result: ENSNode,
        },
      },
    );

    return result;
  }

  async getENSNode(nameOrHashOrAddress: string): Promise<ENSNode> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: ENSNode;
    }>(
      gql`
        query($chainId: Int, $nameOrHashOrAddress: String!) {
          result: ensNode(chainId: $chainId, nameOrHashOrAddress: $nameOrHashOrAddress) {
            hash
            name
            address
            label
            type
            state
            guardianSignature
            createdAt
            updatedAt
          }
        }
      `,
      {
        variables: {
          nameOrHashOrAddress,
        },
        models: {
          result: ENSNode,
        },
      },
    );

    return result;
  }
}
