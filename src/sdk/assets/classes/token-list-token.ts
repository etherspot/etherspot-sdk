import { WithTypename } from '../../common';

export class TokenListToken extends WithTypename {
  address: string;

  name: string;

  symbol: string;

  decimals: number;

  logoURI: string;
}
