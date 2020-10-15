import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class GetPaymentHubDto {
  @IsOptional()
  @IsAddress()
  hub?: string = null;

  @IsOptional()
  @IsAddress()
  token?: string = null;
}
