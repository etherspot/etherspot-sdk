import { ContractNames } from '@etherspot/contracts';
import { Contract } from './contract';
import { PaymentRegistryFunctionsNames } from './constants';

export class PaymentRegistryContract extends Contract<PaymentRegistryFunctionsNames> {
  constructor() {
    super(ContractNames.PaymentRegistry);
  }
}
