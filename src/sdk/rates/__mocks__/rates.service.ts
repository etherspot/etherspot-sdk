import { mockService } from 'src/testing';

export const RatesService = mockService({
  fetchExchangeRates: jest.fn(),
});
