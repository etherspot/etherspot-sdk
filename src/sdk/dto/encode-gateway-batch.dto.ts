import { IsBoolean, IsOptional } from 'class-validator';

export class EncodeGatewayBatchDto {
  @IsOptional()
  @IsBoolean()
  delegate?: boolean = true;
}
