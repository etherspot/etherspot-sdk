import { IsEnum, IsOptional } from 'class-validator';
import { NetworkNames } from '../network';

export class NetworkNameDto {
  @IsOptional()
  @IsEnum(NetworkNames)
  network?: NetworkNames;
}
