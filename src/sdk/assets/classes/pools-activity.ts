import { Type } from 'class-transformer';
import { PoolsActivityTokensInOut } from './pools-activity-tokens-in-out';

export class PoolsActivity {
    amm: string;

    transactionAddress: string;

    timestamp: number;

    amountUSD: number;

    transactionType: string;

    @Type(() => PoolsActivityTokensInOut)
    tokensIn: PoolsActivityTokensInOut[];

    @Type(() => PoolsActivityTokensInOut)
    tokensOut: PoolsActivityTokensInOut[];
}
