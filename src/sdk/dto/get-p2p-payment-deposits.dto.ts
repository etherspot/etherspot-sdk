import { IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class GetP2PPaymentDepositsDto extends NetworkNameDto {
  @IsOptional()
  @IsAddress({
    each: true,
  })
  tokens?: string[] = [];
}
