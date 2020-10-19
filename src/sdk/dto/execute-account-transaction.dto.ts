import { IsOptional } from 'class-validator';
import { BigNumberish, BytesLike } from 'ethers';
import { IsAddress, IsBigNumberish, IsBytesLike } from './validators';

export class ExecuteAccountTransactionDto {
  @IsAddress()
  to: string;

  @IsOptional()
  @IsBigNumberish()
  value?: BigNumberish = null;

  @IsOptional()
  @IsBytesLike()
  data?: BytesLike = null;
}
