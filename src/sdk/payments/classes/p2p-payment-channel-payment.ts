import { Type } from 'class-transformer';
import { BigNumber } from 'ethers';
import { WithTypename, TransformBigNumber } from '../../common';
import { P2PPaymentChannelPaymentStates } from '../constants';

export class P2PPaymentChannelPayment extends WithTypename {
  state: P2PPaymentChannelPaymentStates;

  blockNumber: number;

  @TransformBigNumber()
  value: BigNumber;

  @TransformBigNumber()
  totalAmount: BigNumber;

  senderSignature: string;

  guardianSignature: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
