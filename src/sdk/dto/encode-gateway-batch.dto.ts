import { IsBoolean, IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class EncodeGatewayBatchDto extends NetworkNameDto {
  @IsOptional()
  @IsBoolean()
  delegate?: boolean = true;
}
