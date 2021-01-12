import { Type } from 'class-transformer';
import { TokenListToken } from './token-list-token';

export class TokenList {
  name: string;

  endpoint: string;

  isDefault: boolean;

  @Type(() => TokenListToken)
  tokens: TokenListToken[];

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
