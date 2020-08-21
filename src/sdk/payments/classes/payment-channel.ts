import { TransformBigNumber, WithTypename } from '../../common';
import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { PaymentChannelStates } from '../constants';

export class PaymentChannel extends WithTypename {
  hash: string;

  sender: string;

  recipient: string;

  token: string;

  uid: string;

  state: PaymentChannelStates;

  @TransformBigNumber()
  totalAmount: BigNumber;

  @TransformBigNumber()
  committedAmount: BigNumber;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
