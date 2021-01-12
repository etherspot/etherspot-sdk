import { Type } from 'class-transformer';
import { PaymentHubDeposit } from './payment-hub-deposit';

export class PaymentHubDeposits {
  @Type(() => PaymentHubDeposit)
  items: PaymentHubDeposit[];
}
