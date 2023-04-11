import { IsOptional, IsPositive, IsString } from 'class-validator';
import { IsAddress } from './validators';

export class GetHistoricalTokenPriceDto {
    @IsOptional()
    @IsAddress()
    tokenAddress?: string = null;

    @IsOptional()
    @IsPositive()
    chainId?: number;

    @IsOptional()
    @IsString()
    provider?: string = null;

    @IsOptional()
    @IsString()
    timePeriod?: string;
}
