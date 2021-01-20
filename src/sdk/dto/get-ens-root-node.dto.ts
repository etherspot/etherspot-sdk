import { IsString, IsOptional } from 'class-validator';

export class GetENSRootNodeDto {
  @IsOptional()
  @IsString()
  name: string;
}
