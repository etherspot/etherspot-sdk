import { mockService } from '../../../testing';

export const AssetsService = mockService({
  getTokenLists: jest.fn(),
  getTokenListTokens: jest.fn(),
  getAccountTokenListTokens: jest.fn(),
  isTokenOnTokenList: jest.fn(),
});
