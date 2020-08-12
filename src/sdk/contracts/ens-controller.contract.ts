import { ContractNames } from '@etherspot/contracts';
import { AbstractContract } from './abstract.contract';

export class ENSControllerContract extends AbstractContract {
  constructor() {
    super(ContractNames.ENSController);
  }
}
