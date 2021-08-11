import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class GetCollectiblesTransactionHistoryDto {
  @IsOptional()
  @IsAddress()
  account?: string;
}
