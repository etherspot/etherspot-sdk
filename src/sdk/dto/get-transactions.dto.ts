import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class GetTransactionsDto {
  @IsOptional()
  @IsAddress()
  account?: string;
}
