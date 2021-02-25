import { Type } from 'class-transformer';
import { Account } from '../../account';
import { BaseClass } from '../../common';
import { StoredSession } from '../interfaces';

export class Session extends BaseClass<Session> {
  static fromStoredSession(storedSession: StoredSession<Date | string | number>): Session {
    let result: Session;

    try {
      const { token, ttl } = storedSession;
      const expireAt = new Date(storedSession.expireAt);

      result = new Session({
        token,
        ttl,
        expireAt,
      });
    } catch (err) {
      result = null;
    }

    return result;
  }

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

  toStoredSession?(): StoredSession {
    return {
      token: this.token,
      ttl: this.ttl,
      expireAt: this.expireAt,
    };
  }
}
