import { ContractNames } from '@etherspot/contracts';
import { Contract } from './contract';

export class AccountOwnerRegistryContract extends Contract {
  constructor() {
    super(ContractNames.AccountOwnerRegistry);
  }
}
