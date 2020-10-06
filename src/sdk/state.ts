import { BehaviorSubject, Observable } from 'rxjs';
import { Account, AccountMember } from './account';
import { Session } from './auth';
import { Batch } from './batch';
import { Context } from './context';
import { Network } from './network';
import { Wallet } from './wallet';

export class State {
  constructor(private readonly services: Context['services']) {
    //
  }

  get wallet$(): BehaviorSubject<Wallet> {
    return this.services.walletService.wallet$;
  }

  get wallet(): Wallet {
    return this.services.walletService.wallet;
  }

  get walletAddress$(): Observable<string> {
    return this.services.walletService.walletAddress$;
  }

  get walletAddress(): string {
    return this.services.walletService.walletAddress;
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

  get p2pPaymentDepositAddress$(): BehaviorSubject<string> {
    return this.services.p2pPaymentsService.p2pPaymentDepositAddress$;
  }

  get p2pPaymentDepositAddress(): string {
    return this.services.p2pPaymentsService.p2pPaymentDepositAddress;
  }

  get session$(): BehaviorSubject<Session> {
    return this.services.authService.session$;
  }

  get session(): Session {
    return this.services.authService.session;
  }

  get batch(): Batch {
    return this.services.batchService.batch;
  }

  get batch$(): BehaviorSubject<Batch> {
    return this.services.batchService.batch$;
  }

  get network(): Network {
    return this.services.networkService.network;
  }

  get network$(): BehaviorSubject<Network> {
    return this.services.networkService.network$;
  }
}
