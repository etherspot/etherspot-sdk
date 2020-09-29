import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber, WithTypename } from '../../common';

export class PaymentHubDeposit extends WithTypename {
  owner: string;

  token: string;

  @TransformBigNumber()
  totalAmount: BigNumber;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
