import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { RelayedTransaction } from './relayed-transaction';

export class RelayedTransactions extends PaginationResult<RelayedTransaction> {
  @Type(() => RelayedTransaction)
  items: RelayedTransaction[];
}
