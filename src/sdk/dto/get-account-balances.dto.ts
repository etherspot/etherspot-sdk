import { IsOptional } from 'class-validator';
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
}
