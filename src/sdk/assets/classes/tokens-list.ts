import { Type } from 'class-transformer';
import { WithTypename } from '../../common';
import { TokensListToken } from './tokens-list-token';

export class TokensList extends WithTypename {
  name: string;

  endpoint: string;

  isDefault: boolean;

  @Type(() => TokensListToken)
  tokens: TokensListToken[];

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
