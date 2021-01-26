import { ContractNames } from '@etherspot/contracts';
import { mockContract } from '../../../testing';

export const ERC20TokenContract = mockContract(ContractNames.ERC20Token, {
  encodeTransfer: jest.fn(),
});
