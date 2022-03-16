import { BigNumber } from 'ethers';
import { BaseClass } from '../../common';
import { TransformBigNumber } from '../../common';
import { CrossChainBridgeTransaction, CrossChainBridgeAsset } from './cross-chain-bridge-route-transaction';

export class CrossChainBridgeRoute extends BaseClass<CrossChainBridgeRoute> {

  routeId: string;

  @TransformBigNumber()
  fromAmount: BigNumber;

  @TransformBigNumber()
  toAmount: BigNumber;

  usedBridgeNames:String[];

  chainGasBalances

  totalUserTx

  sender

  totalGasFeesInUsd

  userTxs: CrossChainBridgeTransaction[]

  fromAsset: CrossChainBridgeAsset

  fromChainId

  toAsset: CrossChainBridgeAsset

  toChainId

  routePath: string;

}
