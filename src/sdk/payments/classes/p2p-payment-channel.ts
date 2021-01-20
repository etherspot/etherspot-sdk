import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber } from '../../common';
import { P2PPaymentChannelStates } from '../constants';
import { P2PPaymentChannelPayment } from './p2p-payment-channel-payment';

export class P2PPaymentChannel {
  hash: string;

  @Type(() => P2PPaymentChannelPayment)
  latestPayment: P2PPaymentChannelPayment;

  sender: string;

  recipient: string;

  token: string;

  uid: string;

  state: P2PPaymentChannelStates;

  endangered: boolean;

  @TransformBigNumber()
  totalAmount: BigNumber;

  @TransformBigNumber()
  committedAmount: BigNumber;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
