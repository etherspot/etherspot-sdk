import { BigNumberish, BytesLike } from 'ethers';
// import { Type } from 'class-transformer';
import { TransformBigNumber } from '../../common';
// import { TransactionData } from '../../transactions';
// import { ExchangeProviders } from '../constants';

export class StepTransaction {
  to?: string;

  data?: BytesLike;

  @TransformBigNumber()
  value?: BigNumberish;

  @TransformBigNumber()
  gasLimit?: BigNumberish; 

  @TransformBigNumber()
  gasPrice?: BigNumberish;

  chainId?: number;

  type?: number;
}

export class StepTransactions {
    items: StepTransaction[]
}