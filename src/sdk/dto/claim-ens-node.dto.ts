import { IsString, IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class ClaimENSNodeDto extends NetworkNameDto {
  @IsOptional()
  @IsString()
  nameOrHashOrAddress?: string = null;
}
