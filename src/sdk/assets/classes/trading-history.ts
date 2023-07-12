import { Type } from 'class-transformer';
import { PoolsActivityTokensInOut } from './pools-activity-tokens-in-out';

export class TradingHistory {
    amm: string;

    direction: string;

    transactionAddress: string;

    timestamp: number;

    amountUSD: number;

    walletAddress: string;

    @Type(() => PoolsActivityTokensInOut)
    tokensIn: PoolsActivityTokensInOut[];

    @Type(() => PoolsActivityTokensInOut)
    tokensOut: PoolsActivityTokensInOut[];
}
