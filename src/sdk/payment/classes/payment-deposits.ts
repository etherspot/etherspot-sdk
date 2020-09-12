import { Type } from 'class-transformer';
import { PaymentDeposit } from './payment-deposit';

export class PaymentDeposits {
  @Type(() => PaymentDeposit)
  items: PaymentDeposit[];
}
