import { IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { IsBigNumberish } from './validators';

export class SubmitBatchDto {
  @IsOptional()
  @IsBigNumberish()
  gasPrice?: BigNumberish = null;
}
