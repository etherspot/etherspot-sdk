import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class GetAccount24HourNetCurveDto {
  @IsOptional()
  @IsAddress()
  account?: string = null;

  @IsOptional()
  chainIds?: number[];
}
