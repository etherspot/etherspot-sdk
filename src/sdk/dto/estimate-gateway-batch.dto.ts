import { IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class EstimateGatewayBatchDto extends NetworkNameDto {
  @IsOptional()
  @IsAddress()
  feeToken?: string = null;
}
