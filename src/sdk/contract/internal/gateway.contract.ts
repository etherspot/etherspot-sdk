import { ContractNames } from '@etherspot/contracts';
import { TypedData } from 'ethers-typed-data';
import { TransactionRequest } from '../../common';
import { InternalContract } from './internal.contract';

export class GatewayContract extends InternalContract {
  constructor() {
    super(ContractNames.Gateway);
  }

  encodeSendBatchFromAccount?(account: string, to: string[], data: string[]): TransactionRequest;

  encodeDelegateBatch?(
    account: string,
    nonce: number,
    to: string[],
    data: string[],
    senderSignature: string,
  ): TransactionRequest;

  buildDelegatedBatchTypedData(account: string, nonce: number, to: string[], data: string[]): TypedData {
    return this.buildTypedData(
      'DelegatedBatch',
      [
        { name: 'account', type: 'address' }, //
        { name: 'nonce', type: 'uint256' },
        { name: 'to', type: 'address[]' },
        { name: 'data', type: 'bytes[]' },
      ],
      {
        account, //
        nonce,
        to,
        data,
      },
    );
  }
}
