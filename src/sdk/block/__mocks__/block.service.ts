import { mockService } from '../../../testing';

export const BlockService = mockService({
  getCurrentBlockNumber: jest.fn(),
});
