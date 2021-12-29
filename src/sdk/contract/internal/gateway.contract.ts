import { ContractNames } from '@etherspot/contracts';
import { NetworkNames } from '../../network';
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

  hashDelegatedBatch(account: string, nonce: number, to: string[], data: string[], network?: NetworkNames): Buffer {
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
      network,
    );
  }
}
