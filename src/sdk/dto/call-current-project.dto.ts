import { IsObject, IsOptional } from 'class-validator';
import { CustomProjectMetadataDto } from './custom-project-metadata.dto';

export class CallCurrentProjectDto extends CustomProjectMetadataDto {
  @IsOptional()
  @IsObject()
  payload?: any = null;
}
