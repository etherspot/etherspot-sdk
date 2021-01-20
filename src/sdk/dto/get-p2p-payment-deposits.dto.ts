import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class GetP2PPaymentDepositsDto {
  @IsOptional()
  @IsAddress({
    each: true,
  })
  tokens?: string[] = [];
}
