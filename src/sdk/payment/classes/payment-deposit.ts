import { TransformBigNumber, WithTypename } from '../../common';
import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { PaymentDepositStates } from '../constants';

export class PaymentDeposit extends WithTypename {
  address: string;

  owner: string;

  token: string;

  state: PaymentDepositStates;

  @TransformBigNumber()
  totalAmount?: BigNumber;

  @TransformBigNumber()
  availableAmount?: BigNumber;

  @TransformBigNumber()
  lockedAmount: BigNumber;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
