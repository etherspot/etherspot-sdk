import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';
import { TokenTypes, TransactionAssetCategories } from '../constants';

export class TransactionAsset {
  name: string;

  category: TransactionAssetCategories;

  type: TokenTypes;

  @TransformBigNumber()
  value: BigNumber;

  // @deprecated
  decimal: number;

  decimals: number;

  contract: string;

  from: string;

  to: string;
}
