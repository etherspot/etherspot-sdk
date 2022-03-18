import { BigNumber } from 'ethers';
import { BaseClass } from '../../common';
import { TransformBigNumber } from '../../common';
import { IsNumber } from 'class-validator';


export class ApprovalData {
    @TransformBigNumber()
    minimumApprovalAmount: BigNumber;
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
}

export class CrossChainBridgeGasFee {
    @IsNumber()
    gasLimit: number;
    asset: CrossChainBridgeBridgeAsset;
    feesInUsd: number;
}

export class CrossChainBridgeProtocolFees {
    @IsNumber()
    amount: number;
    feesInUsd: number
    asset: CrossChainBridgeBridgeAsset
}

export class  Protocol extends BaseClass<Protocol> {
    name: string
    displayName: string
    icon: string
  }

export class  Step extends BaseClass<Step> {
    type: string;
    chainId?: number;
    fromAmount: string;
    toAmount: string;
    protocolFees: CrossChainBridgeProtocolFees
    gasFees: CrossChainBridgeGasFee
    toAsset: CrossChainBridgeBridgeAsset
    fromAsset: CrossChainBridgeBridgeAsset
    protocol: Protocol
  }

export class CrossChainBridgeTransaction extends BaseClass<CrossChainBridgeTransaction> {
    userTxType: string;

    txType: string;

    @IsNumber()
    chainId: number;

    fromAsset: CrossChainBridgeBridgeAsset;

    @TransformBigNumber()
    fromAmount: BigNumber;

    @TransformBigNumber()
    toAmount: BigNumber;

    toAsset: CrossChainBridgeBridgeAsset

    stepCount: number;

    routePath: string;

    sender: string;

    approvalData: ApprovalData

    steps: Step[];

    protocolFees: CrossChainBridgeProtocolFees

}
