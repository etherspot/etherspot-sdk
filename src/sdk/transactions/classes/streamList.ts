import { Type } from 'class-transformer';
import { BaseClass } from '../../common';
import { StreamInfo } from './superfluids';

export class StreamList extends BaseClass<StreamList> {
  @Type(() => StreamInfo)
  items: StreamInfo[];

  error: string;
}
