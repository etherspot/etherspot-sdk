import { Type } from 'class-transformer';
import { PaymentHubBridge } from './payment-hub-bridge';

export class PaymentHubBridges {
  @Type(() => PaymentHubBridge)
  items: PaymentHubBridge[];
}
