import { BaseClass } from '../../common';

export class ApprovalData {
  minimumApprovalAmount: string;
  approvalTokenAddress: string;
  allowanceTarget: string;
  owner: string;
}

export class CrossChainBridgeBridgeAsset {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  icon: string;
  chainAgnosticId?: string;
  rank: number;
  updatedAt: string;
  isEnabled: boolean;
  createdAt: string;
}

export class CrossChainBridgeGasFee {
  gasLimit: number;
  asset: CrossChainBridgeBridgeAsset;
  feesInUsd: number;
}

export class CrossChainBridgeProtocolFees {
  amount: number;
  feesInUsd: number;
  asset: CrossChainBridgeBridgeAsset;
}

export class Protocol extends BaseClass<Protocol> {
  name: string;
  displayName: string;
  icon: string;
}

export class Step extends BaseClass<Step> {
  type: string;
  chainId?: number;
  fromChainId?: number;
  fromAmount: string;
  toAmount: string;
  protocolFees: CrossChainBridgeProtocolFees;
  gasFees: CrossChainBridgeGasFee;
  toAsset: CrossChainBridgeBridgeAsset;
  fromAsset: CrossChainBridgeBridgeAsset;
  protocol: Protocol;
}

export class CrossChainBridgeTransaction extends BaseClass<CrossChainBridgeTransaction> {
  userTxType: string;

  txType: string;

  chainId: number;

  fromAsset: CrossChainBridgeBridgeAsset;

  fromAmount: string;

  toAmount: string;

  toAsset: CrossChainBridgeBridgeAsset;

  stepCount: number;

  routePath: string;

  sender: string;

  approvalData: ApprovalData;

  steps: Step[];

  protocolFees: CrossChainBridgeProtocolFees;
}
