import { IsString } from 'class-validator';

export class SetENSRecordTextDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
