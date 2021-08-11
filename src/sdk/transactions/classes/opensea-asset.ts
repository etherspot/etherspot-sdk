import { Type } from 'class-transformer';
import { OpenSeaAssetContract } from './opensea-asset-contract';

export class OpenSeaAsset {
  name?: string;

  @Type(() => OpenSeaAssetContract)
  assetContract: OpenSeaAssetContract;

  tokenId: string;

  description?: string;

  imageUrl?: string;

  imagePreviewUrl?: string;
}
