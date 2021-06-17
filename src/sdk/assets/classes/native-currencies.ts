import { Type } from 'class-transformer';
import { NativeCurrenciesItem } from './native-currencies-item';

export class NativeCurrencies {
  @Type(() => NativeCurrenciesItem)
  items: NativeCurrenciesItem[];
}
