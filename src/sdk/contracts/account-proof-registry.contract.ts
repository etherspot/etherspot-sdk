import { ContractNames } from '@etherspot/contracts';
import { AbstractContract } from './abstract.contract';

export class AccountProofRegistryContract extends AbstractContract {
  constructor() {
    super(ContractNames.AccountProofRegistry);
  }
}
