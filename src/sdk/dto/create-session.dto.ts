import { IsOptional, IsPositive, IsInt, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  ttl?: number = null;

  @IsOptional()
  @IsString()
  fcmToken?: string = null;
}
