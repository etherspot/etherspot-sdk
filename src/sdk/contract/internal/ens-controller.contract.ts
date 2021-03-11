import { BigNumberish, BytesLike } from 'ethers';
import { ContractNames } from '@etherspot/contracts';
import { TransactionRequest } from '../../common';
import { InternalContract } from './internal.contract';

export class ENSControllerContract extends InternalContract {
  constructor() {
    super(ContractNames.ENSController);
  }

  encodeRegisterSubNode?(node: string, label: string, guardianSignature: string): TransactionRequest;

  'encodeSetAddr(bytes32,address)'?: (node: string, address: string) => TransactionRequest;

  'encodeSetAddr(bytes32,uint256,bytes)'?: (
    node: string,
    coinType: BigNumberish,
    address: string,
  ) => TransactionRequest;

  encodeSetName?(node: string, name: string): TransactionRequest;

  encodeSetPubkey?(node: string, x: BytesLike, y: BytesLike): TransactionRequest;

  encodeSetText?(node: string, key: string, value: string): TransactionRequest;

  encodeSetAddr(node: string, address: string): TransactionRequest;
  encodeSetAddr(node: string, coinType: BigNumberish, address: string): TransactionRequest;
  encodeSetAddr(...args: any[]): TransactionRequest {
    let result: TransactionRequest = null;

    switch (args.length) {
      case 2:
        result = this['encodeSetAddr(bytes32,address)'](args[0], args[1]);
        break;

      case 3:
        result = this['encodeSetAddr(bytes32,uint256,bytes)'](args[0], args[1], args[2]);
        break;
    }

    return result;
  }
}
