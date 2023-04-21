import { Type } from 'class-transformer';
import { TradingHistory } from './trading-history';

export class TradingHistories {
    @Type(() => TradingHistory)
    items: TradingHistory[];
}