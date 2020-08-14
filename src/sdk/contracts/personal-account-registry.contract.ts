import { ContractNames } from '@etherspot/contracts';
import { Contract } from './contract';

export class PersonalAccountRegistryContract extends Contract {
  constructor() {
    super(ContractNames.PersonalAccountRegistry);
  }
}
