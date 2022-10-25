import { ContractNames } from '@etherspot/contracts';
import { mockContract } from '../../../../testing';

export const GatewayV2Contract = mockContract(ContractNames.GatewayV2, {
  encodeSendBatchFromAccount: jest.fn(),
  encodeDelegateBatch: jest.fn(),
  buildDelegatedBatchTypedData: jest.fn(),
});
