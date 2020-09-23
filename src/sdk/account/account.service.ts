import { gql } from '@apollo/client/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service, SynchronizedSubject } from '../common';
import { Account, AccountBalance, AccountMember, AccountMembers, Accounts } from './classes';
import { AccountMemberStates, AccountMemberTypes, AccountTypes } from './constants';

export class AccountService extends Service {
  readonly account$ = new SynchronizedSubject<Account>();
  readonly accountMember$ = new SynchronizedSubject<AccountMember>();
  readonly accountAddress$: Observable<string>;

  constructor() {
    super();

    this.accountAddress$ = this.account$.observeKey('address');
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

  computeContractAccount(): void {
    const { walletService } = this.services;
    const { personalAccountRegistryContract } = this.contracts;

    const address = personalAccountRegistryContract.computeAccountCreate2Address(walletService.address);

    if (address) {
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

  async syncAccount(): Promise<Account> {
    const { apiService } = this.services;

    switch (this.account.type) {
      case AccountTypes.Key: {
        const { account } = await apiService.mutate<{
          account: Account;
        }>(
          gql`
            mutation($chainId: Int) {
              account: syncAccount(chainId: $chainId) {
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
            mutation($chainId: Int, $account: String!) {
              accountMember: syncAccountMember(chainId: $chainId, account: $account) {
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

    return this.account;
  }

  async getConnectedAccounts(page: number): Promise<Accounts> {
    const { apiService } = this.services;

    const variables = {
      page: page || 1,
    };

    {
      const { accounts } = await apiService.query<{
        accounts: Accounts;
      }>(
        gql`
          query($chainId: Int, $page: Int) {
            accounts(chainId: $chainId, page: $page) {
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
          variables,
          models: {
            accounts: Accounts,
          },
        },
      );

      return accounts;
    }
  }

  async getAccount(account: string): Promise<Account> {
    const { apiService } = this.services;

    const variables = {
      account,
    };

    {
      const { account } = await apiService.query<{
        account: Account;
      }>(
        gql`
          query($chainId: Int, $account: String!) {
            account(chainId: $chainId, account: $account) {
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
          variables,
          models: {
            account: Account,
          },
        },
      );

      return account;
    }
  }

  async getAccountBalances(account: string, tokens: string[]): Promise<AccountBalance[]> {
    const { apiService } = this.services;

    const variables = {
      account,
      tokens,
    };

    {
      const { account } = await apiService.query<{
        account: Account;
      }>(
        gql`
          query($chainId: Int, $account: String!, $tokens: [String!]) {
            account(chainId: $chainId, account: $account) {
              balances(tokens: $tokens) {
                items {
                  token
                  balance
                }
              }
            }
          }
        `,
        {
          variables,
          models: {
            account: Account,
          },
        },
      );

      return account && account.balances.items ? account.balances.items : [];
    }
  }

  async getAccountMembers(account: string, page: number): Promise<AccountMembers> {
    const { apiService } = this.services;

    const variables = {
      account,
      page: page || 1,
    };

    {
      const { account } = await apiService.query<{
        account: Account;
      }>(
        gql`
          query($chainId: Int, $account: String!, $page: Int) {
            account(chainId: $chainId, account: $account) {
              members(page: $page) {
                items {
                  member {
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
                currentPage
                nextPage
              }
            }
          }
        `,
        {
          variables,
          models: {
            account: Account,
          },
        },
      );

      return account && account.members ? account.members : null;
    }
  }

  protected onInit(): void {
    const { walletService, networkService } = this.services;

    this.addSubscriptions(
      combineLatest([
        walletService.address$, //
        networkService.chainId$,
      ])
        .pipe(
          map(([address]) =>
            !address
              ? null
              : Account.fromPlain({
                  address,
                  type: AccountTypes.Key,
                  synchronizedAt: null,
                }),
          ),
        )
        .subscribe(this.account$),

      this.accountAddress$.pipe(map(() => null)).subscribe(this.accountMember$),
    );
  }
}
