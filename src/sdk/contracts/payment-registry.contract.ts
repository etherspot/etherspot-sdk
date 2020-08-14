import { ContractNames } from '@etherspot/contracts';
import { Contract } from './contract';

export class PaymentRegistryContract extends Contract {
  constructor() {
    super(ContractNames.PaymentRegistry);
  }
}
