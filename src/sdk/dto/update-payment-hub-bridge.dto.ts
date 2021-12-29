import { IsOptional, IsEnum } from 'class-validator';
import { NetworkNames } from '../network';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class UpdatePaymentHubBridgeDto extends NetworkNameDto {
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
