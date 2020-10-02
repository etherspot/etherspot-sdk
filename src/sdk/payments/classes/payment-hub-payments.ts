import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { PaymentHubPayment } from './payment-hub-payment';

export class PaymentHubPayments extends PaginationResult<PaymentHubPayment> {
  @Type(() => PaymentHubPayment)
  items: PaymentHubPayment[];
}
