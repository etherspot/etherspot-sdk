import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { P2PPaymentChannelPayment } from './p2p-payment-channel-payment';

export class P2PPaymentChannelPayments extends PaginationResult<P2PPaymentChannelPayment> {
  @Type(() => P2PPaymentChannelPayment)
  items: P2PPaymentChannelPayment[];
}
