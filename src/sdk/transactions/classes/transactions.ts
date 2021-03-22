import { Type } from 'class-transformer';
import { Transaction } from './transaction';

export class Transactions {
  @Type(() => Transaction)
  items: Transaction[];
}
