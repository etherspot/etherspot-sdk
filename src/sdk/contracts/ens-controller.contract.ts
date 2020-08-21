import { ContractNames } from '@etherspot/contracts';
import { TransactionRequest } from '../common';
import { Contract } from './contract';
import { ENSControllerFunctionsNames } from './constants';

export class ENSControllerContract extends Contract<ENSControllerFunctionsNames> {
  constructor() {
    super(ContractNames.ENSController);
  }

  encodeRegisterSubNode(node: string, label: string, guardianSignature: string): TransactionRequest {
    return this.encodeSelfContractTransactionRequest(
      ENSControllerFunctionsNames.RegisterSubNode,
      node,
      label,
      guardianSignature,
    );
  }
}
