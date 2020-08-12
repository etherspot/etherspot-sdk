import { gql } from 'apollo-boost';
import { plainToClass } from 'class-transformer';
import { AbstractService } from '../common';
import { Session } from './classes';
import { createSessionMessage } from './utils';

export class AuthService extends AbstractService {
  async createSessionCode(): Promise<Session> {
    const {
      wallet,
      services: { apiService },
    } = this.context;

    const account = wallet.address;

    const code = await apiService.mutate<string>(
      gql`
        mutation($account: String!) {
          output: createSessionCode(account: $account)
        }
      `,
      {
        account,
      },
    );

    const message = createSessionMessage(code);
    const signature = await wallet.signMessage(message);

    const session = await apiService.mutate<Session>(
      gql`
        mutation($account: String!, $code: String!, $signature: String!) {
          output: createSession(account: $account, code: $code, signature: $signature) {
            token
            ttl
          }
        }
      `,
      {
        account,
        code,
        signature,
      },
    );

    return plainToClass(Session, session);
  }
}
