import { ContractNames } from '@etherspot/contracts';
import { TransactionRequest } from '../../common';
import { InternalContract } from './internal.contract';

export class GatewayV2Contract extends InternalContract {
  constructor() {
    super(ContractNames.GatewayV2);
  }

  encodeSendBatchFromAccount?(account: string, to: string[], data: string[]): TransactionRequest;

  encodeDelegateBatch?(
    account: string,
    nonce: number,
    to: string[],
    data: string[],
    senderSignature: string,
  ): TransactionRequest;

  encodeSendBatchFromAccountGuarded?(
    account: string,
    to: string[],
    data: string[],
  ): TransactionRequest;

  hashDelegatedBatch(account: string, nonce: number, to: string[], data: string[]): Buffer {
    return this.hashMessagePayload(
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
