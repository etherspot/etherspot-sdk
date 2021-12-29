import { IsString } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';

export class ReserveENSNameDto extends NetworkNameDto {
  @IsString()
  name: string;
}
