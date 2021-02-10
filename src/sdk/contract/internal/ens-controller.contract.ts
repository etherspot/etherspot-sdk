import { ContractNames } from '@etherspot/contracts';
import { TransactionRequest } from '../../common';
import { InternalContract } from './internal.contract';

export class ENSControllerContract extends InternalContract {
  constructor() {
    super(ContractNames.ENSController);
  }

  encodeRegisterSubNode?(node: string, label: string, guardianSignature: string): TransactionRequest;
}
