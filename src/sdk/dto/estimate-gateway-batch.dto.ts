import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class EstimateGatewayBatchDto {
  @IsOptional()
  @IsAddress()
  feeToken?: string = null;

  @IsOptional()
  destChainId?: Number;
}
