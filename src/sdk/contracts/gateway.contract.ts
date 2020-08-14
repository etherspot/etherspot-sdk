import { ContractNames } from '@etherspot/contracts';
import { Contract } from './contract';

export class GatewayContract extends Contract {
  constructor() {
    super(ContractNames.Gateway);
  }
}
