import { mockService } from '../../../testing';

export const ExchangeService = mockService({
  getExchangeSupportedAssets: jest.fn(),
  getExchangeOffers: jest.fn(),
});
