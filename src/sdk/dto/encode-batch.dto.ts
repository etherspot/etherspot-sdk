import { IsBoolean, IsOptional } from 'class-validator';

export class EncodeBatchDto {
  @IsOptional()
  @IsBoolean()
  delegate?: boolean = true;
}
