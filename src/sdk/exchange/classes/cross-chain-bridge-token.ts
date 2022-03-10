import { IsNumber } from 'class-validator';
import { BaseClass } from '../../common';

export class CrossChainBridgeToken extends BaseClass<CrossChainBridgeToken> {
  name: string;

  address: string;

  @IsNumber()
  chainId: number;

  @IsNumber()
  decimals: number;

  symbol: string;

  icon: string;
}
