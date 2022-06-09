import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber } from '../../../common';


export class CrossChainTransactionRequest{
  data: string;

  to: string;

  value: BigNumber;

  from: string;

  chainId: number;

  gasLimit: string;

  gasPrice: string;
}
