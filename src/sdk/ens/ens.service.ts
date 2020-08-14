import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { ENSNode } from './classes';

export class ENSService extends Service {
  async createENSSubNode(name: string): Promise<ENSNode> {
    const { apiService, accountService } = this.services;

    const address = accountService.accountAddress;

    return apiService.mutate(
      gql`
        mutation($address: String!, $name: String!) {
          output: createENSSubNode(address: $address, name: $name) {
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
        Model: ENSNode,
      },
    );
  }
}
