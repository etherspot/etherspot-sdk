import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber, WithTypename } from '../../common';

export class PaymentHub extends WithTypename {
  address: string;

  token: string;

  @TransformBigNumber()
  liquidity: BigNumber;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
