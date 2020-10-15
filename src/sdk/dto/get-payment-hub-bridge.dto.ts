import { IsEnum, IsOptional } from 'class-validator';
import { NetworkNames } from '../network';
import { IsAddress } from './validators';
import { GetPaymentHubDto } from './get-payment-hub.dto';

export class GetPaymentHubBridgeDto extends GetPaymentHubDto {
  @IsOptional()
  @IsEnum(NetworkNames)
  acceptedNetworkName?: NetworkNames = null;

  @IsOptional()
  @IsAddress()
  acceptedToken?: string;
}
