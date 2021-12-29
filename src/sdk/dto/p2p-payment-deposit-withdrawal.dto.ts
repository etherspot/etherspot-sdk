import { IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class P2PPaymentDepositWithdrawalDto extends NetworkNameDto {
  @IsOptional()
  @IsAddress()
  token?: string = null;
}
