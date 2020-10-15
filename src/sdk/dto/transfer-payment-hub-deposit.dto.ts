import { IsOptional, IsEnum } from 'class-validator';
import { BigNumberish } from 'ethers';
import { NetworkNames } from '../network';
import { IsAddress, IsBigNumberish } from './validators';

export class TransferPaymentHubDepositDto {
  @IsAddress()
  hub: string;

  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsBigNumberish()
  value: BigNumberish;

  @IsOptional()
  @IsEnum(NetworkNames)
  targetNetworkName?: NetworkNames = null;

  @IsOptional()
  @IsAddress()
  targetHub?: string = null;

  @IsOptional()
  @IsAddress()
  targetToken?: string = null;
}
