import { BehaviorSubject } from 'rxjs';
import { Account } from './account';
import { Session } from './auth';
import { Context } from './context';

export class State {
  constructor(private readonly services: Context['services']) {
    //
  }

  get account$(): BehaviorSubject<Account> {
    return this.services.accountService.account$;
  }

  get account(): Account {
    return this.services.accountService.account;
  }

  get session$(): BehaviorSubject<Session> {
    return this.services.authService.session$;
  }

  get session(): Session {
    return this.services.authService.session;
  }
}
