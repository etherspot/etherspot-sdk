import { IsObject, IsOptional } from 'class-validator';

export class CallCurrentProjectDto {
  @IsOptional()
  @IsObject()
  payload?: any = null;
}
