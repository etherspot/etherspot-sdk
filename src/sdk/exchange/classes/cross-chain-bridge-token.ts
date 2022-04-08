import { BaseClass } from '../../common';

export class CrossChainBridgeToken extends BaseClass<CrossChainBridgeToken> {
  name: string;

  address: string;

  chainId: number;

  decimals: number;

  symbol: string;

  icon: string;
}
