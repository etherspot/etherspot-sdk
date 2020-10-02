import { PaginationResult } from '../../common';
import { Type } from 'class-transformer';
import { PaymentHub } from './payment-hub';

export class PaymentHubs extends PaginationResult<PaymentHub> {
  @Type(() => PaymentHub)
  items: PaymentHub[];
}
