import { BaseClass } from '../../common';

export class NativeCurrenciesItem extends BaseClass<NativeCurrenciesItem> {
  name: string;

  symbol: string;

  decimals: number;

  chainId: number;

  logoURI: string;
}
