import { BigNumber } from 'ethers';

export class CrossChainTransactionRequest {
  data: string;

  to: string;

  value: BigNumber;

  from: string;

  chainId: number;

  gasLimit: string;

  gasPrice: string;
}
