import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { BigNumberish } from 'ethers';
import { IsAddress, IsBigNumberish } from './validators';

export class TransferPaymentHubDepositDto {
  @IsAddress()
  hub: string;

  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsBigNumberish()
  value: BigNumberish;

  @IsPositive()
  @IsInt()
  targetChainId: number;

  @IsOptional()
  @IsAddress()
  targetHub?: string = null;

  @IsOptional()
  @IsAddress()
  targetToken?: string = null;
}
