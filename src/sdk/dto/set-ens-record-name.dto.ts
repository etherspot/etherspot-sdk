import { IsString, IsOptional } from 'class-validator';

export class SetENSRecordNameDto {
  @IsString()
  @IsOptional()
  name?: string;
}
