import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { PaymentChannel } from './payment-channel';

export class PaymentChannels extends PaginationResult<PaymentChannel> {
  @Type(() => PaymentChannel)
  items: PaymentChannel[];
}
