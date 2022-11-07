import { IsString, IsOptional } from 'class-validator';

export class NameResolutionNodeDto {
  @IsOptional()
  chainId?: number = 1;

  @IsString()
  name: string;
}
