import { Type } from 'class-transformer';
import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';
import { GatewayTransactionStates } from '../constants';
import { GatewaySubmittedBatch } from './gateway-submitted-batch';

export class GatewayTransaction {
  hash: string;

  @Type(() => GatewaySubmittedBatch)
  batches: Array<Partial<GatewaySubmittedBatch>>;

  state: GatewayTransactionStates;

  sender: string;

  @TransformBigNumber()
  gasPrice: BigNumber;

  gasUsed: number;

  @TransformBigNumber()
  totalCost: BigNumber;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
