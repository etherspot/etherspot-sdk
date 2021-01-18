import { Type } from 'class-transformer';
import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';
import { P2PPaymentDepositWithdrawalStates } from '../constants';

export class P2PPaymentDepositWithdrawal {
  state: P2PPaymentDepositWithdrawalStates;

  @TransformBigNumber()
  value: BigNumber;

  @TransformBigNumber()
  totalAmount: BigNumber;

  guardianSignature: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
