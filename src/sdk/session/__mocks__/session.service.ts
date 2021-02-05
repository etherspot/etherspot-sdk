import { mockService } from '../../../testing';

export const SessionService = mockService({
  verifySession: jest.fn(),
  createSession: jest.fn(),
});
