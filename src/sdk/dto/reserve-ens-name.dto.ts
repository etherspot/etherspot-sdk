import { IsString } from 'class-validator';

export class ReserveENSNameDto {
  @IsString()
  name: string;
}
