import { Type } from 'class-transformer';
import { NetCurveBalance } from './net-curve-balance';

export class NetCurveBalances {
    @Type(() => NetCurveBalance)
    items: NetCurveBalance[];
}
