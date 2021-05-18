import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber } from '../../common';
import { TransactionData } from '../../transactions';
import { ExchangeProviders } from '../constants';

export class ExchangeOffer {
  provider: ExchangeProviders;

  @TransformBigNumber()
  receiveAmount: BigNumber;

  exchangeRate: number;

  @Type(() => TransactionData)
  transactions: TransactionData[];
}
