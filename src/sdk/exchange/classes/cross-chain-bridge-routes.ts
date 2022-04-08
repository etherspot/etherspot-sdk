import { Type } from 'class-transformer';
import { BaseClass } from '../../common';
import { CrossChainBridgeRoute } from './cross-chain-bridge-route';

export class CrossChainBridgeRoutes extends BaseClass<CrossChainBridgeRoutes> {
  @Type(() => CrossChainBridgeRoute)
  items: CrossChainBridgeRoute[];
}
