import { IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress, IsBigNumberish } from './validators';

export class WithdrawP2PPaymentDepositDto extends NetworkNameDto {
  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsOptional()
  @IsBigNumberish()
  amount?: BigNumberish = null;
}
