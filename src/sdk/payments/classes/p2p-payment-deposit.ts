import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber } from '../../common';
import { P2PPaymentDepositStates } from '../constants';

export class P2PPaymentDeposit {
  address: string;

  owner: string;

  token: string;

  state: P2PPaymentDepositStates;

  @TransformBigNumber()
  totalAmount: BigNumber;

  @TransformBigNumber()
  availableAmount: BigNumber;

  @TransformBigNumber()
  pendingAmount: BigNumber;

  @TransformBigNumber()
  lockedAmount: BigNumber;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
