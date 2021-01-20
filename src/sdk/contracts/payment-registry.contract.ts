import { ContractNames } from '@etherspot/contracts';
import { BigNumber, BigNumberish } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { prepareAddress, TransactionRequest } from '../common';
import { Contract } from './contract';
import { PaymentRegistryFunctionsNames } from './constants';

export class PaymentRegistryContract extends Contract<PaymentRegistryFunctionsNames> {
  constructor() {
    super(ContractNames.PaymentRegistry);
  }

  encodeWithdrawDeposit(token: string, amount: BigNumberish, guardianSignature: string): TransactionRequest {
    return this.encodeSelfContractTransactionRequest(
      PaymentRegistryFunctionsNames.WithdrawDeposit,
      prepareAddress(token, true),
      amount,
      guardianSignature,
    );
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
      prepareAddress(token, true),
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
      prepareAddress(token, true),
      uid,
      blockNumber,
      amount,
      senderSignature,
      guardianSignature,
    );
  }

  buildDepositWithdrawalTypedData(owner: string, token: string, amount: BigNumberish): TypedData {
    return this.buildTypedData(
      'DepositWithdrawal',
      [
        { name: 'owner', type: 'address' }, //
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      {
        owner, //
        token: prepareAddress(token, true),
        amount: BigNumber.from(amount).toHexString(),
      },
    );
  }

  buildPaymentChannelCommitTypedData(
    sender: string,
    recipient: string,
    token: string,
    uid: string,
    blockNumber: number,
    amount: BigNumberish,
  ): TypedData {
    return this.buildTypedData(
      'PaymentChannelCommit',
      [
        { name: 'sender', type: 'address' }, //
        { name: 'recipient', type: 'address' },
        { name: 'token', type: 'address' },
        { name: 'uid', type: 'bytes32' },
        { name: 'blockNumber', type: 'uint256' },
        { name: 'amount', type: 'uint256' },
      ],
      {
        sender, //
        recipient,
        token: prepareAddress(token, true),
        uid,
        blockNumber,
        amount: BigNumber.from(amount).toHexString(),
      },
    );
  }
}
