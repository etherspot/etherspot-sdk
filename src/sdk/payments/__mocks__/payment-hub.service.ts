import { mockService } from '../../../testing';

export const PaymentHubService = mockService({
  getPaymentHub: jest.fn(),
  getPaymentHubs: jest.fn(),
  getPaymentHubBridge: jest.fn(),
  getPaymentHubBridges: jest.fn(),
  getPaymentHubDeposit: jest.fn(),
  getPaymentHubDeposits: jest.fn(),
  getPaymentHubPayment: jest.fn(),
  getPaymentHubPayments: jest.fn(),
  createPaymentHubPayment: jest.fn(),
  updatePaymentHub: jest.fn(),
  updatePaymentHubDeposit: jest.fn(),
  transferPaymentHubDeposit: jest.fn(),
  activatePaymentHubBridge: jest.fn(),
  deactivatePaymentHubBridge: jest.fn(),
});
