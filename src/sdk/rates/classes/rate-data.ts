import { Type } from 'class-transformer';
import { RateInfo } from './rate-info';

export class RateData {
  errored: boolean;

  error: string;

  @Type(() => RateInfo)
  items: Array<RateInfo>;
}
