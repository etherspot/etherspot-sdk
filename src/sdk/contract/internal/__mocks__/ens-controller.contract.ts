import { ContractNames } from '@etherspot/contracts';
import { mockContract } from '../../../../testing';

export const ENSControllerContract = mockContract(ContractNames.ENSController, {
  encodeRegisterSubNode: jest.fn(),
});
