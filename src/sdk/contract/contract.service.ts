import { gql } from '@apollo/client/core';
import { prepareAddress, Service } from '../common';
import { Contract } from './contract';
import { ExternalContract } from './external';
import { ContractAddresses, ContractEvent, ContractLog } from './interfaces';

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
          data,
          to: prepareAddress(to),
        },
      },
    );

    return result;
  }

  processContractsLogs(logs: ContractLog[]): ContractEvent[] {
    const result: ContractEvent[] = [];

    if (logs && logs.length) {
      const contractsMap = this.buildContractsMap();

      for (const log of logs) {
        const { address } = log;

        if (address && contractsMap.has(address)) {
          const event = contractsMap.get(address).parseLog(log);

          if (event) {
            result.push(event);
          }
        }
      }
    }

    return result;
  }

  private buildContractsMap(): Map<string, Contract> {
    const result = new Map<string, Contract>();

    const contracts = [...this.registeredContracts.values(), ...Object.values(this.internalContracts)];

    for (const contract of contracts) {
      const { address } = contract;

      if (address) {
        result.set(address, contract);
      }
    }

    return result;
  }
}
