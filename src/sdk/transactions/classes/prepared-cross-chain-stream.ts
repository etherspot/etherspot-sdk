import { BigNumberish } from 'ethers';
import { BaseClass } from '../../common';

export class PreparedCrossChainStream extends BaseClass<PreparedCrossChainStream> {
  toChainId: number;

  canonicalToken: string;

  amount: BigNumberish;

  originalToken: string;
}