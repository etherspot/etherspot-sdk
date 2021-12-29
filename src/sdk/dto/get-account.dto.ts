import { IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class GetAccountDto extends NetworkNameDto {
  @IsAddress()
  @IsOptional()
  address?: string = null;
}
