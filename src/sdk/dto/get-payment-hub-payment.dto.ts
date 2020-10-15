import { IsHex32 } from './validators';

export class GetPaymentHubPaymentDto {
  @IsHex32()
  hash: string;
}
