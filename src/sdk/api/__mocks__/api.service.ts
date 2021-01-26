import { mockService } from '../../../testing';

export const ApiService = mockService({
  query: jest.fn(),
  mutate: jest.fn(),
  subscribe: jest.fn(),
});
