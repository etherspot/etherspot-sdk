import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { Contract } from './contract';
import { ExternalContract } from './external';
import { ContractAddresses } from './interfaces';

export class ContractService extends Service {
  protected registeredContracts = new Map<string, Contract>();

  registerContract<T extends {} = {}>(name: string, abi: any, addresses: ContractAddresses): Contract & Partial<T> {
    if (addresses) {
      this.services.networkService.setExternalContractAddresses(name, addresses);
    }

    if (!this.registeredContracts.has(name)) {
      const contract = new ExternalContract(name, abi);

      this.registeredContracts.set(name, contract);

      this.context.attach(contract);
    }

    return this.registeredContracts.get(name) as Contract & Partial<T>;
  }

  async callContract(to: string, data: string): Promise<string> {
    const { apiService } = this.services;

    const { result } = await apiService.mutate<{
      result: string;
    }>(
      gql`
        mutation($chainId: Int, $to: String!, $data: String!) {
          result: callContract(chainId: $chainId, to: $to, data: $data)
        }
      `,
      {
        variables: {
          to,
          data,
        },
      },
    );

    return result;
  }
}
