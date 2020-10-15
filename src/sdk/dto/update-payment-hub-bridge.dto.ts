import { IsOptional, IsEnum } from 'class-validator';
import { NetworkNames } from '../network';
import { IsAddress } from './validators';

export class UpdatePaymentHubBridgeDto {
  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsOptional()
  @IsEnum(NetworkNames)
  acceptedNetworkName?: NetworkNames = null;

  @IsOptional()
  @IsAddress()
  acceptedToken?: string = null;
}
