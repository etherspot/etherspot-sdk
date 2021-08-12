import { Type } from 'class-transformer';
import { OpenSeaAssetTransaction } from './opensea-asset-transaction';
import { OpenSeaAsset } from './opensea-asset';
import { OpenSeaAssetAccount } from './opensea-asset-account';

export class OpenSeaHistoryItem {
  @Type(() => OpenSeaAsset)
  asset: OpenSeaAsset;

  @Type(() => OpenSeaAssetTransaction)
  transaction: OpenSeaAssetTransaction;

  @Type(() => OpenSeaAssetAccount)
  toAccount: OpenSeaAssetAccount;

  @Type(() => OpenSeaAssetAccount)
  fromAccount: OpenSeaAssetAccount;
}
