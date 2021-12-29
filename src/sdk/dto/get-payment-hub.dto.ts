import { IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class GetPaymentHubDto extends NetworkNameDto {
  @IsOptional()
  @IsAddress()
  hub?: string = null;

  @IsOptional()
  @IsAddress()
  token?: string = null;
}
