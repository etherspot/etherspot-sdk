import { TransformBigNumber, WithTypename } from '../../common';
import { Type } from 'class-transformer';
import { BigNumber } from 'ethers';
import { PaymentStates } from '../constants';

export class Payment extends WithTypename {
  state: PaymentStates;

  blockNumber: number;

  @TransformBigNumber()
  value: BigNumber;

  @TransformBigNumber()
  totalAmount: BigNumber;

  senderSignature: string;

  guardianSignature: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
