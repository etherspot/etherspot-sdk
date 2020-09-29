import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { WithTypename, TransformBigNumber } from '../../common';

export class PaymentHubPayment extends WithTypename {
  hash: string;

  sender: string;

  recipient: string;

  @TransformBigNumber()
  value: BigNumber;

  @Type(() => Date)
  createdAt: Date;
}
