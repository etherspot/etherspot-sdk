import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';
import { TransactionAssetCategories } from '../constants';

export class TransactionAsset {
  name: string;

  category: TransactionAssetCategories;

  @TransformBigNumber()
  value: BigNumber;

  // @deprecated
  decimal: number;

  decimals: number;

  contract: string;
}
