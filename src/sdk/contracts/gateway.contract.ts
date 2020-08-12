import { ContractNames } from '@etherspot/contracts';
import { AbstractContract } from './abstract.contract';

export class GatewayContract extends AbstractContract {
  constructor() {
    super(ContractNames.Gateway);
  }
}
