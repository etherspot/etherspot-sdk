import { IsString, IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class GetENSRootNodeDto extends NetworkNameDto {
  @IsOptional()
  @IsString()
  name: string;
}
