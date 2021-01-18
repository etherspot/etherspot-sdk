import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { ENSNode, ENSRootNode, ENSRootNodes } from './classes';

export class ENSService extends Service {
  async reserveENSNode(name: string): Promise<ENSNode> {
    const { apiService, accountService } = this.services;

    const address = accountService.accountAddress;

    const { result } = await apiService.mutate<{
      result: ENSNode;
    }>(
      gql`
        mutation($chainId: Int, $address: String!, $name: String!) {
          result: reserveENSNode(chainId: $chainId, address: $address, name: $name) {
            hash
            name
            address
            label
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

  async getENSRootNode(name: string): Promise<ENSRootNode> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: ENSRootNode;
    }>(
      gql`
        query($chainId: Int, $nameOrHashOrAddress: String!) {
          result: ensRootNode(chainId: $chainId, name: $nameOrHashOrAddress) {
            hash
            name
            state
            createdAt
            updatedAt
          }
        }
      `,
      {
        variables: {
          name,
        },
        models: {
          result: ENSRootNode,
        },
      },
    );

    return result;
  }

  async getENSTopLevelDomains(): Promise<string[]> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: ENSRootNodes;
    }>(
      gql`
        query($chainId: Int) {
          result: ensRootNodes(chainId: $chainId) {
            items {
              name
            }
          }
        }
      `,
      {
        models: {
          result: ENSRootNodes,
        },
      },
    );

    return result.items.map(({ name }) => name);
  }
}
