import { IsPositive, IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { IsAddress, IsBigNumberish } from './validators';

export class CreateCrosschainStreamTransaction {
  @IsOptional()
  @IsAddress()
  account?: string = null;

  @IsAddress()
  canonicalToken: string;

  @IsAddress()
  originalToken: string;

  @IsBigNumberish()
  amount: BigNumberish;
}

