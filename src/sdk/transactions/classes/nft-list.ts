import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { NftCollection } from './nft-collection';

export class NftList extends PaginationResult<NftCollection> {
  @Type(() => NftCollection)
  items: NftCollection[];
}
