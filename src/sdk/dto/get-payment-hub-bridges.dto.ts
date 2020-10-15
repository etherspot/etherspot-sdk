import { IsEnum, IsOptional } from 'class-validator';
import { NetworkNames } from '../network';
import { IsAddress } from './validators';
import { PaginationDto } from './pagination.dto';

export class GetPaymentHubBridgesDto extends PaginationDto {
  @IsAddress()
  hub: string;

  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsOptional()
  @IsEnum(NetworkNames)
  acceptedNetworkName?: NetworkNames;
}
