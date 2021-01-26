import { ContractNames } from '@etherspot/contracts';
import { mockContract } from '../../../testing';

export const GatewayContract = mockContract(ContractNames.Gateway, {
  encodeSendBatchFromAccount: jest.fn(),
  encodeDelegateBatch: jest.fn(),
  buildDelegatedBatchTypedData: jest.fn(),
});
