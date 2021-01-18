import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber } from '../../common';
import { P2PPaymentDepositExitStates } from '../constants';
import { P2PPaymentDepositWithdrawal } from './p2p-payment-deposit-withdrawal';

export class P2PPaymentDeposit {
  @Type(() => P2PPaymentDepositWithdrawal)
  latestWithdrawal: P2PPaymentDepositWithdrawal;

  address: string;

  owner: string;

  token: string;

  exitState: P2PPaymentDepositExitStates;

  @TransformBigNumber()
  totalAmount: BigNumber;

  @TransformBigNumber()
  pendingAmount: BigNumber;

  @TransformBigNumber()
  lockedAmount: BigNumber;

  @TransformBigNumber()
  withdrawAmount: BigNumber;

  @TransformBigNumber()
  availableAmount: BigNumber;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
