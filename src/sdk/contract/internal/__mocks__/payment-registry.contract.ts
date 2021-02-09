import { ContractNames } from '@etherspot/contracts';
import { mockContract } from '../../../../testing';

export const PaymentRegistryContract = mockContract(ContractNames.PaymentRegistry, {
  encodeWithdrawDeposit: jest.fn(),
  encodeCommitPaymentChannelAndWithdraw: jest.fn(),
  encodeCommitPaymentChannelAndDeposit: jest.fn(),
  buildDepositWithdrawalTypedData: jest.fn(),
  buildPaymentChannelCommitTypedData: jest.fn(),
});
