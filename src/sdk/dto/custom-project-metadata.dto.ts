import { IsOptional, MaxLength } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class CustomProjectMetadataDto extends NetworkNameDto {
  @IsOptional()
  @MaxLength(128)
  customProjectMetadata?: string = null;
}
