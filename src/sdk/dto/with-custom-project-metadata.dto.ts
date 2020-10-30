import { IsOptional, MaxLength } from 'class-validator';

export class WithCustomProjectMetadataDto {
  @IsOptional()
  @MaxLength(128)
  customProjectMetadata?: string = null;
}
