import { IsOptional, MaxLength } from 'class-validator';

export class SwitchCurrentProjectDto {
  @MaxLength(66)
  key: string;

  @IsOptional()
  @MaxLength(128)
  metadata: string = null;
}
