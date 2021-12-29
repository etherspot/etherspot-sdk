import { IsOptional, IsEnum } from 'class-validator';
import { BigNumberish } from 'ethers';
import { NetworkNames } from '../network';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress, IsBigNumberish } from './validators';

export class TransferPaymentHubDepositDto extends NetworkNameDto {
  @IsAddress()
  hub: string;

  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsBigNumberish({
    positive: true,
  })
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
