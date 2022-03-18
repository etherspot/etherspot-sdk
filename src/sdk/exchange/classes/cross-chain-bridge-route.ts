import { BigNumber } from 'ethers';
import { BaseClass } from '../../common';
import { TransformBigNumber } from '../../common';
import { CrossChainBridgeTransaction, CrossChainBridgeBridgeAsset } from './cross-chain-bridge-route-transaction';

export class CrossChainBridgeRoute extends BaseClass<CrossChainBridgeRoute> {

  routeId: string;

  @TransformBigNumber()
  fromAmount: BigNumber;

  @TransformBigNumber()
  toAmount: BigNumber;

  usedBridgeNames:String[];

  chainGasBalances: JSON;

  totalUserTx: number;

  sender: string;

  totalGasFeesInUsd:number;

  userTxs: JSON; //CrossChainBridgeTransaction[]

  fromAsset: CrossChainBridgeBridgeAsset

  fromChainId

  toAsset: CrossChainBridgeBridgeAsset

  toChainId: number

  routePath: string;

}
