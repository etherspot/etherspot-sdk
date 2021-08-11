import { Type } from 'class-transformer';
import { OpenSeaAsset } from './opensea-asset';

export class OpenSeaAssets {
  @Type(() => OpenSeaAsset)
  items: OpenSeaAsset[];
}
