import { ContractNames } from '@etherspot/contracts';
import { AbstractContract } from './abstract.contract';

export class PersonalAccountRegistryContract extends AbstractContract {
  constructor() {
    super(ContractNames.PersonalAccountRegistry);
  }
}
