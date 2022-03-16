import { IsNumber } from 'class-validator';
import { BaseClass } from '../../common';


export class approvalData {
    minimumApprovalAmount
    approvalTokenAddress
    allowanceTarget
    owner
}

export class CrossChainBridgeAsset {
    chainId
    address
    symbol
    name
    decimals
    icon
}

export class CrossChainBridgeGasFee {
    @IsNumber()
    gasLimit:number;
    asset:CrossChainBridgeAsset
    feesInUsd
}


export class CrossChainBridgeTransaction extends BaseClass<CrossChainBridgeTransaction> {
    userTxType: string;

    txType: string;

    @IsNumber()
    chainId: number;

    fromAsset:CrossChainBridgeAsset;

    fromAmount

    toAmount

    toAsset:CrossChainBridgeAsset

    stepCount

    routePath

    sender

    approvalData: approvalData

    steps

}
