import { Type } from 'class-transformer';
import { TokenList } from './token-list';

export class TokenLists {
  @Type(() => TokenList)
  items: TokenList[];
}
