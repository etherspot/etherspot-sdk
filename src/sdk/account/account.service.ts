import { gql } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { prepareAddress, Service, SynchronizedSubject } from '../common';
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

  async syncAccount(): Promise<Account> {
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

    return this.account;
  }

  async getConnectedAccounts(page: number): Promise<Accounts> {
    const { apiService } = this.services;

    const { accounts } = await apiService.query<{
      accounts: Accounts;
    }>(
      gql`
        query($page: Int!) {
          accounts(page: $page) {
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
          accounts: Accounts,
        },
      },
    );

    return accounts;
  }

  async getAccount(address: string): Promise<Account> {
    const { apiService } = this.services;

    const { account } = await apiService.query<{
      account: Account;
    }>(
      gql`
        query($address: String!) {
          account(address: $address) {
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
        variables: {
          address,
        },
        models: {
          account: Account,
        },
      },
    );

    return account;
  }

  async getAccountBalances(address: string, tokens: string[]): Promise<AccountBalance[]> {
    const { apiService } = this.services;

    const { account } = await apiService.query<{
      account: Account;
    }>(
      gql`
        query($address: String!, $tokens: [String!]!) {
          account(address: $address) {
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
        variables: {
          address,
          tokens: tokens.map((token) => prepareAddress(token, true)),
        },
        models: {
          account: Account,
        },
      },
    );

    return account && account.balances.items ? account.balances.items : [];
  }

  async getAccountMembers(address: string, page: number): Promise<AccountMembers> {
    const { apiService } = this.services;

    const { account } = await apiService.query<{
      account: Account;
    }>(
      gql`
        query($address: String!, $page: Int) {
          account(address: $address) {
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
        variables: {
          address,
          page,
        },
        models: {
          account: Account,
        },
      },
    );

    return account.members;
  }

  protected onInit(): void {
    const { walletService } = this.services;

    this.addSubscriptions(
      walletService.address$
        .pipe(
          map((address) =>
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
