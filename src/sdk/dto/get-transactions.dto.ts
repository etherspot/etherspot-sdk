import { IsOptional } from 'class-validator';
import { NetworkNameDto } from './network-name.dto';
import { IsAddress } from './validators';

export class GetTransactionsDto extends NetworkNameDto {
  @IsOptional()
  @IsAddress()
  account?: string;
}
