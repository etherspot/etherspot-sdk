import { Type } from 'class-transformer';
import { WithTypename } from '../../common';
import { PaymentHubDeposit } from './payment-hub-deposit';

export class PaymentHubDeposits extends WithTypename {
  @Type(() => PaymentHubDeposit)
  items: PaymentHubDeposit[];
}
