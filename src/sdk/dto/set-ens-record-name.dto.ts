import { IsString, IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class SetENSRecordNameDto extends NetworkNameDto {
  @IsString()
  @IsOptional()
  name?: string;
}
