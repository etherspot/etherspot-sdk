import { ContractNames, getContractAddress } from '@etherspot/contracts';
import { mockService } from './mock-service';

/**
 * @ignore
 */
export function mockContract(contractName: ContractNames, mocked: {}): unknown {
  mocked = {
    ...mocked,
  };

  Object.defineProperty(mocked, 'address', {
    get: jest.fn(() => getContractAddress(contractName, 9999)),
  });

  return mockService({
    ...mocked,
    computeAccountCreate2Address: jest.fn(),
    buildTypedData: jest.fn(),
  });
}
