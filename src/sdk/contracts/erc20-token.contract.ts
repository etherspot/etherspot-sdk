import { ContractNames } from '@etherspot/contracts';
import { Contract } from './contract';

export class ERC20TokenContract extends Contract {
  constructor() {
    super(ContractNames.ERC20Token);
  }
}
