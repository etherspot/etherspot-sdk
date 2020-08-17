import { ContractNames } from '@etherspot/contracts';
import { Contract } from './contract';

export class ENSControllerContract extends Contract {
  constructor() {
    super(ContractNames.ENSController);
  }
}
