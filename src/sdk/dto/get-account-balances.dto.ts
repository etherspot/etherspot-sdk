import { IsOptional, IsPositive, IsString } from 'class-validator';
import { IsAddress } from './validators';

export class GetAccountBalancesDto {
  @IsOptional()
  @IsAddress()
  account?: string = null;

  @IsOptional()
  @IsAddress({
    each: true,
  })
  tokens?: string[] = [];

  @IsOptional()
  @IsPositive()
  chainId?: number;

  @IsOptional()
  @IsString()
  provider?: string = null;
}
