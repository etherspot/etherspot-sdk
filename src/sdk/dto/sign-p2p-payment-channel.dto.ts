import { IsHex32 } from './validators';

export class SignP2PPaymentChannelDto {
  @IsHex32()
  hash: string;
}
