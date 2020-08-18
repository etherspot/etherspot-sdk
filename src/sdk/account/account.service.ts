import { gql } from '@apollo/client/core';
import { Wallet } from 'ethers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service, SynchronizedSubject } from '../common';
import { Account, AccountMember, Accounts } from './classes';
import { AccountMemberStates, AccountMemberTypes, AccountTypes } from './constants';

export class AccountService extends Service {
  readonly account$ = new SynchronizedSubject<Account>();
  readonly accountMember$ = new SynchronizedSubject<AccountMember>();
  readonly accountAddress$: Observable<string>;

  constructor() {
    super();

    this.accountAddress$ = this.account$.observeKey('address');
  }

  protected onInit(): void {
    this.addSubscription(
      this.accountAddress$ //
        .pipe(map(() => null))
        .subscribe(this.accountMember$),
    );
  }

  get account(): Account {
    return this.account$.value;
  }

  get accountAddress(): string {
    return this.account ? this.account.address : null;
  }

  get accountMember(): AccountMember {
    return this.accountMember$.value;
  }

  createAccountFromWallet(wallet: Wallet): void {
    const { address } = wallet;

    this.account$.next(
      Account.fromPlain({
        address,
        type: AccountTypes.Key,
        synchronizedAt: null,
      }),
    );
  }

  computeContractAccount(): void {
    const { walletService } = this.services;
    const { personalAccountRegistryContract } = this.contracts;

    const address = personalAccountRegistryContract.computeAccountCreate2Address(walletService.address);

    this.account$.next(
      Account.fromPlain({
        address,
        type: AccountTypes.Contract,
        synchronizedAt: null,
      }),
    );

    this.accountMember$.next(
      AccountMember.fromPlain({
        state: AccountMemberStates.Added,
        type: AccountMemberTypes.Owner,
        synchronizedAt: null,
      }),
    );
  }

  joinContractAccount(address: string): void {
    this.account$.next(
      Account.fromPlain({
        address,
        type: AccountTypes.Contract,
        synchronizedAt: null,
      }),
    );
  }

  async syncAccount(): Promise<void> {
    const { apiService } = this.services;

    switch (this.account.type) {
      case AccountTypes.Key: {
        const { account } = await apiService.mutate<{
          account: Account;
        }>(
          gql`
            mutation {
              account: syncAccount {
                address
                type
                state
                store
                createdAt
                updatedAt
              }
            }
          `,
          {
            models: {
              account: Account,
            },
          },
        );

        this.account$.next(account);
        break;
      }

      case AccountTypes.Contract: {
        const {
          accountMember: { account, ...accountMember },
        } = await apiService.mutate<{
          accountMember: AccountMember;
        }>(
          gql`
            mutation($account: String!) {
              accountMember: syncAccountMember(account: $account) {
                account {
                  address
                  type
                  state
                  store
                  createdAt
                  updatedAt
                }
                type
                state
                store
                createdAt
                updatedAt
              }
            }
          `,
          {
            variables: {
              account: this.accountAddress,
            },
            models: {
              accountMember: AccountMember,
            },
          },
        );

        this.account$.next(account);
        this.accountMember$.next(accountMember);
        break;
      }
    }
  }

  async getConnectedAccounts(page: number): Promise<Accounts> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: Accounts;
    }>(
      gql`
        query($page: Int!) {
          result: accounts(page: $page) {
            items {
              address
              type
              state
              store
              createdAt
              updatedAt
            }
            currentPage
            nextPage
          }
        }
      `,
      {
        variables: {
          page,
        },
        models: {
          result: Accounts,
        },
      },
    );

    return result;
  }
}
