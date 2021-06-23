import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { ENSNode, ENSRootNode, ENSRootNodes } from './classes';
import { ENS_ADDR_REVERSE_TLD } from './constants';

export class ENSService extends Service {
  get ensAddrReversOwner(): Promise<string> {
    return this.getENSNodeOwner(ENS_ADDR_REVERSE_TLD);
  }

  async getENSNodeOwner(name: string): Promise<string> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: string;
    }>(
      gql`
        query($chainId: Int, $name: String!) {
          result: ensNodeOwner(chainId: $chainId, name: $name)
        }
      `,
      {
        variables: {
          name,
        },
      },
    );

    return result;
  }

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
            zone
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

  async validateENSNode(name: string): Promise<boolean> {
    const { apiService, accountService } = this.services;

    const address = accountService.accountAddress;

    const { result } = await apiService.mutate<{
      result: boolean;
    }>(
      gql`
        query($chainId: Int, $address: String!, $name: String!) {
          result: validateENSNode(chainId: $chainId, address: $address, name: $name)
        }
      `,
      {
        variables: {
          name,
          address,
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
            zone
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

  async ensAddressesLookup(names: string[]): Promise<string[]> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: {
        items: string[];
      };
    }>(
      gql`
        query($chainId: Int, $names: [String!]) {
          result: ensAddressesLookup(chainId: $chainId, names: $names) {
            items
          }
        }
      `,
      {
        variables: {
          names,
        },
      },
    );

    return result.items;
  }

  async ensNamesLookup(addresses: string[]): Promise<string[]> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: {
        items: string[];
      };
    }>(
      gql`
        query($chainId: Int, $addresses: [String!]) {
          result: ensNamesLookup(chainId: $chainId, addresses: $addresses) {
            items
          }
        }
      `,
      {
        variables: {
          addresses,
        },
      },
    );

    return result.items;
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
