import { IsOptional, MaxLength } from 'class-validator';

export class SwitchProjectDto {
  @MaxLength(66)
  key: string;

  @IsOptional()
  @MaxLength(128)
  metadata: string = null;
}
