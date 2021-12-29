import { gql } from '@apollo/client/core';
import { NetworkNames, networkNameToChainId } from '../network';
import { Service } from '../common';
import { ENSNode, ENSRootNode, ENSRootNodes } from './classes';
import { ENS_ADDR_REVERSE_TLD } from './constants';

export class ENSService extends Service {
  get ensAddrReversOwner(): Promise<string> {
    return this.getENSNodeOwner(ENS_ADDR_REVERSE_TLD);
  }

  async getENSNodeOwner(name: string, network?: NetworkNames): Promise<string> {
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
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async reserveENSNode(name: string, network?: NetworkNames): Promise<ENSNode> {
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
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async validateENSNode(name: string, network?: NetworkNames): Promise<boolean> {
    const { apiService, accountService } = this.services;

    const address = accountService.accountAddress;

    const { result } = await apiService.query<{
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
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async getENSNode(nameOrHashOrAddress: string, network?: NetworkNames): Promise<ENSNode> {
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
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async getENSRootNode(name: string, network?: NetworkNames): Promise<ENSRootNode> {
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
        chainId: networkNameToChainId(network),
      },
    );

    return result;
  }

  async ensAddressesLookup(names: string[], network?: NetworkNames): Promise<string[]> {
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
        chainId: networkNameToChainId(network),
      },
    );

    return result.items;
  }

  async ensNamesLookup(addresses: string[], network?: NetworkNames): Promise<string[]> {
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
        chainId: networkNameToChainId(network),
      },
    );

    return result.items;
  }

  async getENSTopLevelDomains(network?: NetworkNames): Promise<string[]> {
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
        chainId: networkNameToChainId(network),
      },
    );

    return result.items.map(({ name }) => name);
  }
}
