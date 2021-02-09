import { ContractNames } from '@etherspot/contracts';
import { BigNumberish } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { TransactionRequest } from '../../common';
import { InternalContract } from './internal.contract';

export class PaymentRegistryContract extends InternalContract {
  constructor() {
    super(ContractNames.PaymentRegistry);
  }

  encodeWithdrawDeposit?(token: string, amount: BigNumberish, guardianSignature: string): TransactionRequest;

  encodeCommitPaymentChannelAndWithdraw?(
    sender: string,
    token: string,
    uid: string,
    blockNumber: number,
    amount: BigNumberish,
    senderSignature: string,
    guardianSignature: string,
  ): TransactionRequest;

  encodeCommitPaymentChannelAndDeposit?(
    sender: string,
    token: string,
    uid: string,
    blockNumber: number,
    amount: BigNumberish,
    senderSignature: string,
    guardianSignature: string,
  ): TransactionRequest;

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
        token,
        amount,
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
        token,
        uid,
        blockNumber,
        amount,
      },
    );
  }
}
