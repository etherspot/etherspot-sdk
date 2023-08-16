import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common/transformers/transform-big-number';

export class AdvanceRouteToken {
    address: string;

    symbol: string;

    decimals?: number;

    name: string;
}

export class FeesToken {
    address: string;

    symbol: string;

    decimals?: number;

    chain: string;
}

export class FeesCost {
    type: string;

    token: FeesToken;

    @TransformBigNumber()
    amount: BigNumber;

    amountUSD?: string;
}

export class AdvanceRoute {
    provider: string;

    fromToken: AdvanceRouteToken;

    toToken: AdvanceRouteToken;

    duration: number;

    gasUSD: string;

    tool: string;

    @TransformBigNumber()
    amount: BigNumber;

    amountUSD: string;

    feeCosts?: FeesCost[];

    gasCosts?: FeesCost[];
}
