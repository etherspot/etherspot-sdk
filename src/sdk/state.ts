import { BehaviorSubject, Observable } from 'rxjs';
import { Account, AccountMember } from './account';
import { Session } from './auth';
import { Batch } from './batch';
import { Context } from './context';

export class State {
  constructor(private readonly services: Context['services']) {
    //
  }

  get walletAddress$(): BehaviorSubject<string> {
    return this.services.walletService.address$;
  }

  get walletAddress(): string {
    return this.services.walletService.address;
  }

  get account$(): BehaviorSubject<Account> {
    return this.services.accountService.account$;
  }

  get account(): Account {
    return this.services.accountService.account;
  }

  get accountAddress$(): Observable<string> {
    return this.services.accountService.accountAddress$;
  }

  get accountAddress(): string {
    return this.services.accountService.accountAddress;
  }

  get accountMember$(): BehaviorSubject<AccountMember> {
    return this.services.accountService.accountMember$;
  }

  get accountMember(): AccountMember {
    return this.services.accountService.accountMember;
  }

  get batch$(): BehaviorSubject<Batch> {
    return this.services.batchService.batch$;
  }

  get batch(): Batch {
    return this.services.batchService.batch;
  }

  get session$(): BehaviorSubject<Session> {
    return this.services.authService.session$;
  }

  get session(): Session {
    return this.services.authService.session;
  }
}
