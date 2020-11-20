import { Type } from 'class-transformer';
import { TokensListToken } from './tokens-list-token';

export class TokensList {
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
