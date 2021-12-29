import { IsOptional, IsPositive, IsInt, IsString } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class CreateSessionDto extends NetworkNameDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  ttl?: number = null;

  @IsOptional()
  @IsString()
  fcmToken?: string = null;
}
