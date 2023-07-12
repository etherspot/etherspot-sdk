import { Type } from 'class-transformer';
import { HistoricalTokenPrice } from './historical-token-price';

export class HistoricalTokenPrices {
    @Type(() => HistoricalTokenPrice)
    items: HistoricalTokenPrice[];
}
