import { mockService } from '../../../testing';

export const ENSService = mockService({
  reserveENSNode: jest.fn(),
  getENSNode: jest.fn(),
  getENSRootNode: jest.fn(),
  getENSTopLevelDomains: jest.fn(),
});
