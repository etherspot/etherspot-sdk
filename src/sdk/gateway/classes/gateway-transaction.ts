import { Type } from 'class-transformer';
import { BigNumber } from 'ethers';
import { TransformBigNumber, WithTypename } from '../../common';
import { GatewayTransactionStates } from '../constants';

export class GatewayTransaction extends WithTypename {
  hash: string;

  state: GatewayTransactionStates;

  sender: string;

  @TransformBigNumber()
  gasPrice: BigNumber;

  estimatedGas: number;

  @TransformBigNumber()
  estimatedCost: BigNumber;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
