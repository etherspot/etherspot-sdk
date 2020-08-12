import { ContractNames } from '@etherspot/contracts';
import { AbstractContract } from './abstract.contract';

export class ENSRegistryContract extends AbstractContract {
  constructor() {
    super(ContractNames.ENSRegistry);
  }
}
