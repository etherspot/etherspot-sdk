import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';
import { PaginationDto } from './pagination.dto';

export class GetRelayedTransactionsDto extends PaginationDto {
  @IsOptional()
  @IsAddress()
  account?: string = null;
}
