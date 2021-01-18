import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class P2PPaymentDepositWithdrawalDto {
  @IsOptional()
  @IsAddress()
  token?: string = null;
}
