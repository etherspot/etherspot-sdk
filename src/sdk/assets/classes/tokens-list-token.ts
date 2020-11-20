import { WithTypename } from '../../common';

export class TokensListToken extends WithTypename {
  address: string;

  name: string;

  symbol: string;

  decimals: number;

  logoURI: string;
}
