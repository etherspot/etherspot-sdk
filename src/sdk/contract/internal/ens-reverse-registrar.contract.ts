import { ContractNames } from '@etherspot/contracts';
import { TransactionRequest } from '../../common';
import { InternalContract } from './internal.contract';

export class ENSReverseRegistrarContract extends InternalContract {
  constructor() {
    super(ContractNames.ENSReverseRegistrar);
  }

  encodeSetName?(name: string): TransactionRequest;
}
