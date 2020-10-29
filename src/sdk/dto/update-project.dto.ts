import { GetProjectDto } from './get-project.dto';
import { IsHex32, IsUrl } from './validators';

export class UpdateProjectDto extends GetProjectDto {
  @IsHex32()
  privateKey: string;

  @IsUrl()
  endpoint: string;
}
