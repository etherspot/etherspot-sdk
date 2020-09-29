import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { P2PPaymentChannel } from './p2p-payment-channel';

export class P2PPaymentChannels extends PaginationResult<P2PPaymentChannel> {
  @Type(() => P2PPaymentChannel)
  items: P2PPaymentChannel[];
}
