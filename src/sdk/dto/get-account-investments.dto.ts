import { IsOptional, IsPositive, IsString } from 'class-validator';
import { IsAddress } from './validators';

export class GetAccountInvestmentsDto {
  @IsOptional()
  @IsAddress()
  account?: string = null;
  
  @IsOptional()
  @IsPositive()
  chainId?: number;
  
  @IsOptional()
  apps?: string[] = [];

  @IsOptional()
  @IsString()
  provider?: string = null;
}
