import { ContractNames } from '@etherspot/contracts';
import { BigNumberish, BytesLike } from 'ethers';
import { TransactionRequest } from '../../common';
import { InternalContract } from './internal.contract';

export class PersonalAccountRegistryContract extends InternalContract {
  constructor() {
    super(ContractNames.PersonalAccountRegistry);
  }

  encodeRefundAccountCall?(account: string, refundToken: string, refundAmount: BigNumberish): TransactionRequest;

  encodeAddAccountOwner?(account: string, owner: string): TransactionRequest;

  encodeRemoveAccountOwner?(account: string, owner: string): TransactionRequest;

  encodeExecuteAccountTransaction?(
    account: string,
    to: string,
    value: BigNumberish,
    data: BytesLike,
  ): TransactionRequest;
}
