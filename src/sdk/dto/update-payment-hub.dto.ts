import { IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { IsAddress, IsBigNumberish } from './validators';

export class UpdatePaymentHubDto {
  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsOptional()
  @IsBigNumberish()
  liquidity?: BigNumberish = null;
}
