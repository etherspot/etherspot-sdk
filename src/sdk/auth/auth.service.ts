import { gql } from '@apollo/client/core';
import { Service, SynchronizedSubject } from '../common';
import { Session } from './classes';
import { createSessionMessage } from './utils';

export class AuthService extends Service {
  static TOKEN_HEADER_NAME = 'x-auth-token';

  readonly session$ = new SynchronizedSubject<Session>();

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
    if (!this.session || !this.session.valid) {
      await this.createSession();
    }
  }

  async createSession(): Promise<Session> {
    const { apiService, walletService } = this.services;

    const account = walletService.address;
    const code = await apiService.mutate<string>(
      gql`
        mutation($account: String!) {
          output: createSessionCode(account: $account)
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

    const session = await apiService.mutate(
      gql`
        mutation($account: String!, $code: String!, $signature: String!) {
          output: createSession(account: $account, code: $code, signature: $signature) {
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
        },
        Model: Session,
      },
    );

    this.session$.next(session);

    return session;
  }
}
