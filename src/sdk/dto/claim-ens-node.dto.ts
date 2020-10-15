import { IsString, IsOptional } from 'class-validator';

export class ClaimENSNodeDto {
  @IsOptional()
  @IsString()
  nameOrHashOrAddress?: string = null;
}
