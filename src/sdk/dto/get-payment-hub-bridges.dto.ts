import { IsEnum, IsOptional } from 'class-validator';
import { NetworkNames } from '../network';
import { IsAddress } from './validators';
import { PaginationDto } from './pagination.dto';

export class GetPaymentHubBridgesDto extends PaginationDto {
  @IsOptional()
  @IsAddress()
  hub?: string = null;

  @IsOptional()
  @IsAddress()
  token?: string = null;

  @IsOptional()
  @IsEnum(NetworkNames)
  acceptedNetworkName?: NetworkNames;
}
