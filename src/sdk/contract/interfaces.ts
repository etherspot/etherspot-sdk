import { utils } from 'ethers';

export type ContractAddresses = { [key: string]: string } | string;

export interface ContractLog {
  address?: string;
  topics: string[];
  data: string;
}

export interface ContractEvent {
  contract: string;
  event: string;
  args: utils.Result;
}
