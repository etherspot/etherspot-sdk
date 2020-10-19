import { IsOptional, IsPositive, IsInt } from 'class-validator';

export class CreateSessionDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  ttl?: number = null;
}
