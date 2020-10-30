import { IsObject, IsOptional } from 'class-validator';
import { WithCustomProjectMetadataDto } from './with-custom-project-metadata.dto';

export class CallCurrentProjectDto extends WithCustomProjectMetadataDto {
  @IsOptional()
  @IsObject()
  payload?: any = null;
}
