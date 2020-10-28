import { IsUrl } from 'class-validator';
import { GetProjectDto } from './get-project.dto';
import { IsHex32 } from './validators';

export class UpdateProjectDto extends GetProjectDto {
  @IsHex32()
  privateKey: string;

  @IsUrl()
  endpoint: string;
}
