import { TypedData } from 'ethers-typed-data';

export interface TransactionRequest {
  to: string;
  data: string;
}

export interface UnChainedTypedData<M = any> {
  primaryType: string;
  domain: Omit<TypedData['domain'], 'chainId'>;
  types: TypedData['types'];
  message: M;
}
