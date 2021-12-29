import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class GetGatewaySupportedTokenDto extends NetworkNameDto {
  @IsAddress()
  token: string;
}
