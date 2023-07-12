import { IsOptional, IsPositive, IsString } from 'class-validator';
import { IsAddress } from './validators';

export class GetTokenDetailsDto {
  @IsOptional()
  @IsAddress()
  tokenAddress?: string = null;
  
  @IsOptional()
  @IsPositive()
  chainId?: number;

  @IsOptional()
  @IsString()
  provider?: string = null;
}
