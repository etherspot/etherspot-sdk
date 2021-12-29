import { IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class GetAccountBalancesDto extends NetworkNameDto {
  @IsOptional()
  @IsAddress()
  account?: string = null;

  @IsOptional()
  @IsAddress({
    each: true,
  })
  tokens?: string[] = [];
}
