import { ContractNames } from '@etherspot/contracts';
import { AbstractContract } from './abstract.contract';

export class PaymentRegistryContract extends AbstractContract {
  constructor() {
    super(ContractNames.PaymentRegistry);
  }
}
