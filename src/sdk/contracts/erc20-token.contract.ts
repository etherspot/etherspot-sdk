import { ContractNames } from '@etherspot/contracts';
import { AbstractContract } from './abstract.contract';

export class ERC20TokenContract extends AbstractContract {
  constructor() {
    super(ContractNames.ERC20Token);
  }
}
