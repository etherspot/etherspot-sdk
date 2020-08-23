import { ContractNames } from '@etherspot/contracts';
import { BigNumberish, constants } from 'ethers';
import { TransactionRequest } from '../common';
import { Contract } from './contract';
import { PaymentRegistryFunctionsNames } from './constants';

export class PaymentRegistryContract extends Contract<PaymentRegistryFunctionsNames> {
  constructor() {
    super(ContractNames.PaymentRegistry);
  }

  encodeCommitPaymentChannelAndWithdraw(
    sender: string,
    token: string,
    uid: string,
    blockNumber: number,
    amount: BigNumberish,
    senderSignature: string,
    guardianSignature: string,
  ): TransactionRequest {
    return this.encodeSelfContractTransactionRequest(
      PaymentRegistryFunctionsNames.CommitPaymentChannelAndWithdraw,
      sender,
      token || constants.AddressZero,
      uid,
      blockNumber,
      amount,
      senderSignature,
      guardianSignature,
    );
  }

  encodeCommitPaymentChannelAndDeposit(
    sender: string,
    token: string,
    uid: string,
    blockNumber: number,
    amount: BigNumberish,
    senderSignature: string,
    guardianSignature: string,
  ): TransactionRequest {
    return this.encodeSelfContractTransactionRequest(
      PaymentRegistryFunctionsNames.CommitPaymentChannelAndDeposit,
      sender,
      token || constants.AddressZero,
      uid,
      blockNumber,
      amount,
      senderSignature,
      guardianSignature,
    );
  }
}
