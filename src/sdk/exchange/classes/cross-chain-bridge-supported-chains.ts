
import { Type } from 'class-transformer';
import { BaseClass } from '../../common';
import { CrossChainBridgeSupportedChain } from './cross-chain-bridge-supported-chain';

export class CrossChainBridgeSupportedChains extends BaseClass<CrossChainBridgeSupportedChains> {
  @Type(() => CrossChainBridgeSupportedChain)
  items: CrossChainBridgeSupportedChain[];
}
