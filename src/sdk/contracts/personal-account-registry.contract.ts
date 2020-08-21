import { ContractNames } from '@etherspot/contracts';
import { BigNumberish, BytesLike, constants } from 'ethers';
import { TransactionRequest } from '../common';
import { PersonalAccountRegistryFunctionsNames } from './constants';
import { Contract } from './contract';

export class PersonalAccountRegistryContract extends Contract<PersonalAccountRegistryFunctionsNames> {
  constructor() {
    super(ContractNames.PersonalAccountRegistry);
  }

  encodeRefundAccountCall(account: string, refundToken: string, refundAmount: BigNumberish): TransactionRequest {
    return this.encodeSelfContractTransactionRequest(
      PersonalAccountRegistryFunctionsNames.RefundAccountCall,
      account,
      refundToken || constants.AddressZero,
      refundAmount,
    );
  }

  encodeAddAccountOwner(account: string, owner: string): TransactionRequest {
    return this.encodeSelfContractTransactionRequest(
      PersonalAccountRegistryFunctionsNames.AddAccountOwner,
      account,
      owner,
    );
  }

  encodeRemoveAccountOwner(account: string, owner: string): TransactionRequest {
    return this.encodeSelfContractTransactionRequest(
      PersonalAccountRegistryFunctionsNames.RemoveAccountOwner,
      account,
      owner,
    );
  }

  encodeExecuteAccountTransaction(
    account: string,
    to: string,
    value: BigNumberish,
    data: BytesLike,
  ): TransactionRequest {
    return this.encodeSelfContractTransactionRequest(
      PersonalAccountRegistryFunctionsNames.ExecuteAccountTransaction,
      account,
      to,
      value || 0,
      data || '0x',
    );
  }
}
