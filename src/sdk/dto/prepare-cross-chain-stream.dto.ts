import { IsBoolean, IsPositive, IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { IsAddress, IsBigNumberish } from './validators';

export class PrepareCrosschainStreamTransaction {
  @IsOptional()
  @IsAddress()
  account?: string = null;

  @IsAddress()
  fromTokenAddress: string;

  @IsAddress()
  toTokenAddress: string;

  @IsPositive()
  toChainId: number;

  @IsBigNumberish()
  fromAmount: BigNumberish;

  @IsOptional()
  @IsBoolean()
  disableSwapping: boolean;
}