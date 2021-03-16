import { ContractNames } from '@etherspot/contracts';
import { BigNumberish, utils } from 'ethers';
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

  computePaymentDepositAccountAddress(saltOwner: string): string {
    let result: string = null;

    if (saltOwner) {
      result = this.computeCreate2Address(
        ContractNames.PaymentDepositAccount,
        utils.solidityKeccak256(['address'], [saltOwner]),
      );
    }

    return result;
  }

  hashDepositWithdrawal(owner: string, token: string, amount: BigNumberish): Buffer {
    return this.hashMessagePayload(
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

  hashPaymentChannelCommit(
    sender: string,
    recipient: string,
    token: string,
    uid: string,
    blockNumber: number,
    amount: BigNumberish,
  ): Buffer {
    return this.hashMessagePayload(
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
