import { Type } from 'class-transformer';
import { OpenSeaHistoryItem } from './opensea-history-item';

export class OpenSeaHistory {
  @Type(() => OpenSeaHistoryItem)
  items: OpenSeaHistoryItem[];
}
