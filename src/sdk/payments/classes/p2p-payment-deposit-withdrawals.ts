import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { P2PPaymentDepositWithdrawal } from './p2p-payment-deposit-withdrawal';

export class P2PPaymentDepositWithdrawals extends PaginationResult<P2PPaymentDepositWithdrawal> {
  @Type(() => P2PPaymentDepositWithdrawal)
  items: P2PPaymentDepositWithdrawal[];
}
