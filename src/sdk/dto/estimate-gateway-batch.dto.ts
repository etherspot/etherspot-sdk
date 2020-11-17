import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class EstimateGatewayBatchDto {
  @IsOptional()
  @IsAddress()
  refundToken?: string = null;
}
