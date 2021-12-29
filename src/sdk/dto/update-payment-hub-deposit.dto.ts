import { IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress, IsBigNumberish } from './validators';

export class UpdatePaymentHubDepositDto extends NetworkNameDto {
  @IsAddress()
  hub: string;

  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsOptional()
  @IsBigNumberish()
  totalAmount?: BigNumberish = null;
}
