import { gql } from '@apollo/client/core';
import { plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';
import { Service, ObjectSubject } from '../common';
import { Session } from './classes';
import { createSessionMessage } from './utils';

export class AuthService extends Service {
  static TOKEN_HEADER_NAME = 'x-auth-token';

  readonly session$ = new ObjectSubject<Session>();

  get session(): Session {
    return this.session$.value;
  }

  get headers(): { [key: string]: any } {
    return this.session
      ? {
          [AuthService.TOKEN_HEADER_NAME]: this.session.token,
        }
      : {};
  }

  async verifySession(): Promise<void> {
    if (this.session && !this.session.verify()) {
      this.session$.next(null);
    }

    if (!this.session) {
      await this.createSession();
    } else {
      this.session.refresh();
    }
  }

  restoreSession(session: Session): Session {
    session = plainToClass(Session, session);

    if (!session.verify()) {
      session = null;
    }

    this.session$.next(session);

    return session;
  }

  async createSession(ttl?: number): Promise<Session> {
    const { apiService, walletService } = this.services;

    const account = walletService.address;

    const { code } = await apiService.mutate<{
      code: string;
    }>(
      gql`
        mutation($account: String!) {
          code: createSessionCode(account: $account)
        }
      `,
      {
        variables: {
          account,
        },
      },
    );

    const message = createSessionMessage(code);
    const signature = await walletService.personalSignMessage(message);

    const { session } = await apiService.mutate<{
      session: Session;
    }>(
      gql`
        mutation($account: String!, $code: String!, $signature: String!, $ttl: Int) {
          session: createSession(account: $account, code: $code, signature: $signature, ttl: $ttl) {
            token
            ttl
          }
        }
      `,
      {
        variables: {
          account,
          code,
          signature,
          ttl,
        },
        models: {
          session: Session,
        },
      },
    );

    session.refresh();

    this.session$.next(session);

    return session;
  }

  protected onInit() {
    const { walletService } = this.services;

    this.addSubscriptions(
      walletService.address$
        .pipe(
          map(() => null), //
        )
        .subscribe(this.session$),
    );
  }
}
