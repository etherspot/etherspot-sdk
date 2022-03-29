import { Type } from 'class-transformer';
import { BaseClass } from '../../common';
import { CrossChainBridgeChainCurrency } from './cross-chain-bridge-chain-currency';

export class CrossChainBridgeSupportedChain extends BaseClass<CrossChainBridgeSupportedChain> {
  chainId: number;

  name: string;

  isL1: boolean;

  sendingEnabled: boolean;

  icon: string;

  receivingEnabled: boolean;

  @Type(() => CrossChainBridgeChainCurrency)
  currency: CrossChainBridgeChainCurrency;

  rpcs: string[];

  explorers: string[];
}
