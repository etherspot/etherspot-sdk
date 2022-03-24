import { BaseClass } from '../../common';
import { CrossChainBridgeBridgeAsset } from './cross-chain-bridge-route-transaction';

export class CrossChainBridgeApprovalData extends BaseClass<CrossChainBridgeApprovalData> {
  minimumApprovalAmount: string;
  approvalTokenAddress: string;
  allowanceTarget: string;
  owner: string;
}

export class CrossChainBridgeBuildTXResponse extends BaseClass<CrossChainBridgeBuildTXResponse> {
  userTxType: string;
  txType: string;
  txData: string;
  txTarget: string;
  chainId: number;
  value: string;
  approvalData: CrossChainBridgeApprovalData;
}

export class CrossChainBridgeRoute extends BaseClass<CrossChainBridgeRoute> {
  routeId: string;

  fromAmount: string;

  toAmount: string;

  usedBridgeNames: string[];

  chainGasBalances: JSON;

  totalUserTx: number;

  sender: string;

  totalGasFeesInUsd: number;

  userTxs: JSON; //CrossChainBridgeTransaction[]

  fromAsset: CrossChainBridgeBridgeAsset;

  fromChainId;

  toAsset: CrossChainBridgeBridgeAsset;

  toChainId?: number;

  routePath: string;
}

export class CrossChainBridgeRouteRoute extends BaseClass<CrossChainBridgeRouteRoute> {
  route: CrossChainBridgeRoute;
}
