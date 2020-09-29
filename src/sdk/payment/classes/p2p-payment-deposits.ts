import { WithTypename } from '../../common';
import { Type } from 'class-transformer';
import { P2PPaymentDeposit } from './p2p-payment-deposit';

export class P2PPaymentDeposits extends WithTypename {
  @Type(() => P2PPaymentDeposit)
  items: P2PPaymentDeposit[];
}
