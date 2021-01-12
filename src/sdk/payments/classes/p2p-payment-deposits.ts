import { Type } from 'class-transformer';
import { P2PPaymentDeposit } from './p2p-payment-deposit';

export class P2PPaymentDeposits {
  @Type(() => P2PPaymentDeposit)
  items: P2PPaymentDeposit[];
}
