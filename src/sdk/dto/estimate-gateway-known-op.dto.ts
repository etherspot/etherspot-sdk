import { IsEnum, IsOptional } from 'class-validator';
import { GatewayKnownOps } from '../gateway';
import { IsAddress } from './validators';

export class EstimateGatewayKnownOpDto {
  @IsEnum(GatewayKnownOps)
  op: GatewayKnownOps;

  @IsOptional()
  @IsAddress()
  feeToken?: string = null;
}
