import { Type } from 'class-transformer';
import { Account } from '../../account';
import { BaseClass } from '../../common';

export class Session extends BaseClass<Session> {
  static TTL_MARGIN = 3000;

  token: string;

  ttl: number;

  @Type(() => Account)
  account?: Account;

  @Type(() => Date)
  expireAt?: Date;

  refresh?(): void {
    const now = new Date();
    this.expireAt = new Date(now.getTime() + this.ttl * 1000);
  }

  verify?(): boolean {
    return this.expireAt.getTime() + Session.TTL_MARGIN > Date.now();
  }
}
