import { ContractNames } from '@etherspot/contracts';
import { Contract } from './contract';

export class ENSRegistryContract extends Contract {
  constructor() {
    super(ContractNames.ENSRegistry);
  }
}
