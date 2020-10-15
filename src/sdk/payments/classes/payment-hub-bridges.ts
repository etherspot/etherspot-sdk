import { Type } from 'class-transformer';
import { WithTypename } from '../../common/classes';
import { PaymentHubBridge } from './payment-hub-bridge';

export class PaymentHubBridges extends WithTypename {
  @Type(() => PaymentHubBridge)
  items: PaymentHubBridge[];
}
