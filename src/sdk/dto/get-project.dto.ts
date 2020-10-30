import { IsString, MaxLength } from 'class-validator';

export class GetProjectDto {
  @IsString()
  @MaxLength(66)
  key: string;
}
