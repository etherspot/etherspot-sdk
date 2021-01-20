import { ContractNames } from '@etherspot/contracts';
import { TypedData } from 'ethers-typed-data';
import { TransactionRequest } from '../common';
import { Contract } from './contract';
import { GatewayFunctionsNames } from './constants';

export class GatewayContract extends Contract<GatewayFunctionsNames> {
  constructor() {
    super(ContractNames.Gateway);
  }

  encodeSendBatchFromAccount(account: string, to: string[], data: string[]): TransactionRequest {
    return this.encodeSelfContractTransactionRequest(
      GatewayFunctionsNames.SendBatchFromAccount, //
      account,
      to,
      data,
    );
  }

  encodeDelegateBatch(
    account: string,
    nonce: number,
    to: string[],
    data: string[],
    senderSignature: string,
  ): TransactionRequest {
    return this.encodeSelfContractTransactionRequest(
      GatewayFunctionsNames.DelegateBatch, //
      account,
      nonce,
      to,
      data,
      senderSignature,
    );
  }

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
