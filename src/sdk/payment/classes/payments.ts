import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { Payment } from './payment';

export class Payments extends PaginationResult<Payment> {
  @Type(() => Payment)
  items: Payment[];
}
