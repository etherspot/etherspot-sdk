import { IsAddress } from './validators';

export class GetGatewaySupportedTokenDto {
  @IsAddress()
  token: string;
}
