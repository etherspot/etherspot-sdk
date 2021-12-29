import { IsString } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class SetENSRecordTextDto extends NetworkNameDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
