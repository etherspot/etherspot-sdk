import { IsHex32 } from './validators';

export class GetP2PPaymentChannelDto {
  @IsHex32()
  hash: string;
}
