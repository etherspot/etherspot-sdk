import { mockService } from '../../../testing';
import { UniqueSubject } from '../../common';

const p2pPaymentDepositAddress$ = new UniqueSubject<string>();

const mocked = {
  p2pPaymentDepositAddress$,
  syncP2PPaymentDeposit: jest.fn(),
  syncP2PPaymentDeposits: jest.fn(),
  getP2PPaymentChannel: jest.fn(),
  getP2PPaymentChannels: jest.fn(),
  getP2PPaymentChannelPayments: jest.fn(),
  decreaseP2PPaymentDeposit: jest.fn(),
  updateP2PPaymentDeposit: jest.fn(),
  increaseP2PPaymentChannelAmount: jest.fn(),
  updateP2PPaymentChannel: jest.fn(),
  signP2PPaymentChannel: jest.fn(),
  buildP2PPaymentDepositWithdrawalTransactionRequest: jest.fn(),
};

Object.defineProperty(mocked, 'p2pPaymentDepositAddress', {
  get: jest.fn(() => p2pPaymentDepositAddress$.value),
});

export const P2PPaymentService = mockService(mocked);
