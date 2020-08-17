import { ContractNames } from '@etherspot/contracts';
import { Contract } from './contract';

export class AccountProofRegistryContract extends Contract {
  constructor() {
    super(ContractNames.AccountProofRegistry);
  }
}
