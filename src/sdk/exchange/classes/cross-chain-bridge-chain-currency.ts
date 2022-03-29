import { IsNumber } from 'class-validator';
import { BigNumber } from 'ethers';
import { BaseClass, TransformBigNumber } from '../../common';

export class CrossChainBridgeChainCurrency extends BaseClass<CrossChainBridgeChainCurrency> {
  address: string;

  icon: string;

  name: string;

  symbol: string;

  decimals: number;

  @TransformBigNumber()
  minNativeCurrencyForGas: BigNumber;
}
