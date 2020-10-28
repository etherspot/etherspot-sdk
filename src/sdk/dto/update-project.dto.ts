/* eslint-disable @typescript-eslint/camelcase */
import { IsUrl } from 'class-validator';
import { GetProjectDto } from './get-project.dto';
import { IsHex32 } from './validators';

export class UpdateProjectDto extends GetProjectDto {
  @IsHex32()
  privateKey: string;

  @IsUrl({
    protocols: ['http', 'https'],
    require_tld: false,
    require_host: true,
    require_protocol: true,
  })
  endpoint: string;
}
