import { Type } from 'class-transformer';
import { TokensList } from './tokens-list';

export class TokensLists {
  @Type(() => TokensList)
  items: TokensList[];
}
