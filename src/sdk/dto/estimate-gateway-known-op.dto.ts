import { IsEnum, IsOptional } from 'class-validator';
import { GatewayKnownOps } from '../gateway';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class EstimateGatewayKnownOpDto extends NetworkNameDto {
  @IsEnum(GatewayKnownOps)
  op: GatewayKnownOps;

  @IsOptional()
  @IsAddress()
  feeToken?: string = null;
}
