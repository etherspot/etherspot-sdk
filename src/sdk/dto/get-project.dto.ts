import { IsString, MaxLength } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class GetProjectDto extends NetworkNameDto {
  @IsString()
  @MaxLength(66)
  key: string;
}
