import { mockService } from '../../../testing';
import { UniqueSubject } from '../../common';
import { GatewayBatch } from '../interfaces';

const gatewayBatch$ = new UniqueSubject<GatewayBatch>(null);

const mocked = {
  batchGatewayTransactionRequest: jest.fn(),
  clearGatewayBatch: jest.fn(),
  getGatewaySupportedToken: jest.fn(),
  getGatewaySupportedTokens: jest.fn(),
  getGatewaySubmittedBatch: jest.fn(),
  getGatewaySubmittedBatches: jest.fn(),
  estimateGatewayBatch: jest.fn(),
  submitGatewayBatch: jest.fn(),
  encodeGatewayBatch: jest.fn(),
};

Object.defineProperty(mocked, 'gatewayBatch', {
  get: jest.fn(() => gatewayBatch$.value),
});

export const GatewayService = mockService(mocked);
