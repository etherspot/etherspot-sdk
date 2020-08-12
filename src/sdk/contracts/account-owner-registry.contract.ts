import { ContractNames } from '@etherspot/contracts';
import { AbstractContract } from './abstract.contract';

export class AccountOwnerRegistryContract extends AbstractContract {
  constructor() {
    super(ContractNames.AccountOwnerRegistry);
  }
}
