import { IsOptional, MaxLength } from 'class-validator';

export class CustomProjectMetadataDto {
  @IsOptional()
  @MaxLength(128)
  customProjectMetadata?: string = null;

  @IsOptional()
  guarded?: boolean = false;
}
