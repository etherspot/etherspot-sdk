import { IsString, IsOptional } from 'class-validator';

export class GetENSNodeDto {
  @IsOptional()
  @IsString()
  nameOrHashOrAddress?: string = null;
}
