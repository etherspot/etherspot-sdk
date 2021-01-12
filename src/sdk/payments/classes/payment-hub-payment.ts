import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber } from '../../common';
import { PaymentHub } from './payment-hub';

export class PaymentHubPayment {
  @Type(() => PaymentHub)
  hub?: Partial<PaymentHub>;

  hash: string;

  sender: string;

  recipient: string;

  @TransformBigNumber()
  value: BigNumber;

  @Type(() => Date)
  createdAt: Date;
}
