import { Type } from 'class-transformer';
import { WithTypename } from '../../common';
import { TokensList } from './tokens-list';

export class TokensLists extends WithTypename {
  @Type(() => TokensList)
  items: TokensList[];
}
