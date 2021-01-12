import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber } from '../../common';
import { P2PPaymentChannelStates } from '../constants';
import { P2PPaymentChannelPayment } from './p2p-payment-channel-payment';
import { P2PPaymentChannelPayments } from './p2p-payment-channel-payments';

export class P2PPaymentChannel {
  hash: string;

  @Type(() => P2PPaymentChannelPayment)
  latestPayment: P2PPaymentChannelPayment;

  @Type(() => P2PPaymentChannelPayments)
  payments?: P2PPaymentChannelPayments;

  sender: string;

  recipient: string;

  token: string;

  uid: string;

  state: P2PPaymentChannelStates;

  @TransformBigNumber()
  totalAmount: BigNumber;

  @TransformBigNumber()
  committedAmount: BigNumber;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
