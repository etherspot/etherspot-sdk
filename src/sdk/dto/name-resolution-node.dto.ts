import { IsString, IsOptional } from 'class-validator';

export class NameResolutionNodeDto {
  @IsOptional()
  @IsString()
  chainId?: number = 1;

  @IsString()
  name: string;
}
