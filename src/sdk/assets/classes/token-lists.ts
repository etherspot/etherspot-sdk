import { Type } from 'class-transformer';
import { WithTypename } from '../../common';
import { TokenList } from './token-list';

export class TokenLists extends WithTypename {
  @Type(() => TokenList)
  items: TokenList[];
}
