import { Type } from 'class-transformer';
import { BaseClass } from '../../common';
import { CrossChainBridgeToken } from './cross-chain-bridge-token';

export class CrossChainBridgeTokenList extends BaseClass<CrossChainBridgeTokenList> {
  @Type(() => CrossChainBridgeToken)
  items: CrossChainBridgeToken[];
}
