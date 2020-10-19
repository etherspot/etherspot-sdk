import { IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { IsAddress, IsBigNumberish } from './validators';

export class CreatePaymentHubPaymentDto {
  @IsAddress()
  hub: string;

  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsAddress()
  recipient: string;

  @IsBigNumberish()
  value: BigNumberish;
}
