import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber } from '../../common';
import { PaymentHub } from './payment-hub';

export class PaymentHubDeposit {
  @Type(() => PaymentHub)
  hub?: Partial<PaymentHub>;

  owner: string;

  @TransformBigNumber()
  totalAmount: BigNumber;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
