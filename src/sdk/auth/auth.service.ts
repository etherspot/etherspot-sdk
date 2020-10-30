import { gql } from '@apollo/client/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service, ObjectSubject, HeaderNames } from '../common';
import { Session } from './classes';
import { createSessionMessage } from './utils';

export class AuthService extends Service {
  readonly session$ = new ObjectSubject<Session>();

  get session(): Session {
    return this.session$.value;
  }

  get headers(): { [key: string]: any } {
    return this.session
      ? {
          [HeaderNames.AuthToken]: this.session.token,
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

  async createSession(ttl?: number): Promise<Session> {
    const { apiService, walletService } = this.services;

    const { walletAddress } = walletService;

    const { code } = await apiService.mutate<{
      code: string;
    }>(
      gql`
        mutation($chainId: Int, $account: String!) {
          code: createSessionCode(chainId: $chainId, account: $account)
        }
      `,
      {
        variables: {
          account: walletAddress,
        },
      },
    );

    const message = createSessionMessage(code);
    const signature = await walletService.personalSignMessage(message);

    const { session } = await apiService.mutate<{
      session: Session;
    }>(
      gql`
        mutation($chainId: Int, $account: String!, $code: String!, $signature: String!, $ttl: Int) {
          session: createSession(chainId: $chainId, account: $account, code: $code, signature: $signature, ttl: $ttl) {
            token
            ttl
            account {
              address
              type
              state
              store
              createdAt
              updatedAt
            }
          }
        }
      `,
      {
        variables: {
          code,
          signature,
          ttl,
          account: walletAddress,
        },
        models: {
          session: Session,
        },
      },
    );

    const { account } = session;

    delete session.account;

    if (account.address !== walletAddress) {
      const { providerType } = walletService.wallet;

      walletService.wallet$.next({
        address: account.address,
        providerType,
      });
    }

    session.refresh();

    this.session$.next(session);

    return session;
  }

  protected onInit() {
    const { walletService, networkService } = this.services;

    this.addSubscriptions(
      combineLatest([
        walletService.walletAddress$, //
        networkService.chainId$,
      ])
        .pipe(
          map(() => null), //
        )
        .subscribe(this.session$),
    );
  }
}
