import { IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { IsAddress, IsBigNumberish } from './validators';

export class UpdatePaymentHubDepositDto {
  @IsAddress()
  hub: string;

  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsOptional()
  @IsBigNumberish()
  totalAmount?: BigNumberish = null;
}
