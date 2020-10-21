import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Service } from '../common';
import { Account, AccountMember } from '../account';
import { Session } from '../auth';
import { Batch } from '../batch';
import { Network } from '../network';
import { Wallet } from '../wallet';
import { State, StateOptions } from './interfaces';

export class StateService extends Service implements State {
  readonly state$ = new BehaviorSubject<State>(null);

  constructor(private options: StateOptions = {}) {
    super();
  }

  get state(): State {
    return this.state$.value;
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

  get batch$(): BehaviorSubject<Batch> {
    return this.services.batchService.batch$;
  }

  get batch(): Batch {
    return this.services.batchService.batch;
  }

  get network(): Network {
    return this.services.networkService.network;
  }

  get network$(): BehaviorSubject<Network> {
    return this.services.networkService.network$;
  }

  protected onInit() {
    const { storage } = this.options || {};

    const {
      walletService: { wallet$, wallet },
      accountService: { account$, accountMember$ },
      p2pPaymentsService: { p2pPaymentDepositAddress$ },
      authService: { session$ },
      batchService: { batch$ },
      networkService: { network$, network },
    } = this.services;

    const callback = () => {
      this.addSubscriptions(
        combineLatest([
          wallet$, //
          account$,
          accountMember$,
          p2pPaymentDepositAddress$,
          session$,
          batch$,
          network$,
        ])
          .pipe(
            map(
              ([
                wallet, //
                account,
                accountMember,
                p2pPaymentDepositAddress,
                session,
                batch,
                network,
              ]: [
                State['wallet'], //
                State['account'],
                State['accountMember'],
                State['p2pPaymentDepositAddress'],
                State['session'],
                State['batch'],
                State['network'],
              ]) => ({
                wallet, //
                account,
                accountMember,
                p2pPaymentDepositAddress,
                session,
                batch,
                network,
              }),
            ),
          )
          .subscribe(this.state$),

        !storage
          ? null
          : this.state$
              .pipe(
                filter(
                  (state) =>
                    state && //
                    state.wallet &&
                    state.wallet.address &&
                    state.network &&
                    state.network.name &&
                    true,
                ),
                tap((state) => {
                  const { wallet, network, ...storageState } = state;
                  this.error$.catch(
                    () => storage.setState(wallet.address, network.name, storageState), //
                  );
                }),
              )
              .subscribe(),
      );
    };

    if (storage) {
      this.error$.catch(async () => {
        const walletAddress = wallet && wallet.address ? wallet.address : null;
        const networkName = network && network.name ? network.name : null;

        if (walletAddress && networkName) {
          const state = await storage.getState(walletAddress, networkName);

          if (state) {
            const { account, accountMember, p2pPaymentDepositAddress, session, batch } = state;

            account$.next(account);
            accountMember$.next(accountMember);
            p2pPaymentDepositAddress$.next(p2pPaymentDepositAddress);
            session$.next(session);
            batch$.next(batch);
          }
        }
      }, callback);
    } else {
      callback();
    }
  }
}
