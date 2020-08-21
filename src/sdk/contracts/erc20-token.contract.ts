import { ContractNames } from '@etherspot/contracts';
import { Contract } from './contract';
import { ERC20TokenFunctionsNames } from './constants';

export class ERC20TokenContract extends Contract<ERC20TokenFunctionsNames> {
  constructor() {
    super(ContractNames.ERC20Token);
  }
}
