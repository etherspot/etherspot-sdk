import { Type } from 'class-transformer';
import { TokenListToken } from './token-list-token';

export class TokenListTokens {
  @Type(() => TokenListToken)
  items: TokenListToken[];
}
