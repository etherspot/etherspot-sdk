import { mockService } from '../../../testing';

export const AssetsService = mockService({
  getTokenLists: jest.fn(),
  getTokenListTokens: jest.fn(),
  getAccountTokenListTokens: jest.fn(),
  isTokenOnTokenList: jest.fn(),
  getTokenDetails: jest.fn(),
  getHistoricalTokenPrice: jest.fn(),
  getPoolsActivity: jest.fn(),
  getNumberOfTransactions: jest.fn(),
  getTradingHistory: jest.fn(),
  getMarketDetails: jest.fn(),
});
