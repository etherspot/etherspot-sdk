import { gql } from '@apollo/client/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeaderNames, Service, SynchronizedSubject, keccak256 } from '../common';
import {
  Account,
  AccountBalances,
  AccountDashboard,
  AccountMember,
  AccountMembers,
  Accounts,
  AccountSettings,
  AccountTotalBalances,
} from './classes';
import { AccountMemberStates, AccountMemberTypes, AccountTypes, Currencies } from './constants';
import { IsEligibleForAirdropDto, UpdateAccountSettingsDto } from '../dto';

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

  get headers(): { [key: string]: any } {
    return this.accountAddress
      ? {
          [HeaderNames.AnalyticsToken]: keccak256(this.accountAddress),
        }
      : {};
  }

  computeContractAccount(): void {
    const { walletService } = this.services;
    const { personalAccountRegistryContract } = this.internalContracts;

    const address = personalAccountRegistryContract.computeAccountAddress(walletService.walletAddress);

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

    const { result } = await apiService.query<{
      result: Accounts;
    }>(
      gql`
        query($chainId: Int, $page: Int) {
          result: accounts(chainId: $chainId, page: $page) {
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
          page: page || 1,
        },
        models: {
          result: Accounts,
        },
      },
    );

    return result;
  }

  async getAccount(account: string): Promise<Account> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: Account;
    }>(
      gql`
        query($chainId: Int, $account: String!) {
          result: account(chainId: $chainId, account: $account) {
            ensNode {
              hash
              name
              label
              address
              state
              zone
              createdAt
              updatedAt
            }
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
          account,
        },
        models: {
          result: Account,
        },
      },
    );

    return result;
  }

  async getAccountBalances(account: string, tokens: string[]): Promise<AccountBalances> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: AccountBalances;
    }>(
      gql`
        query($chainId: Int, $account: String!, $tokens: [String!]) {
          result: accountBalances(chainId: $chainId, account: $account, tokens: $tokens) {
            items {
              token
              balance
            }
          }
        }
      `,
      {
        variables: {
          account,
          tokens,
        },
        models: {
          result: AccountBalances,
        },
      },
    );

    return result;
  }

  async getAccountDashboard(account: string, currency: string, days?: number): Promise<AccountDashboard> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: AccountDashboard;
    }>(
      gql`
        query($chainId: Int, $account: String!, $currency: String!, $days: Float) {
          result: accountDashboard(chainId: $chainId, account: $account, currency: $currency, days: $days) {
            history {
              balance
              timestamp
            }
            wallet {
              balance
              netChange
            }
          }
        }
      `,
      {
        variables: {
          account,
          currency,
          days,
        },
        models: {
          result: AccountDashboard,
        },
      },
    );

    return result;
  }

  async getAccountTotalBalances(account: string, currency: Currencies): Promise<AccountTotalBalances> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: AccountTotalBalances;
    }>(
      gql`
        query($account: String!, $currency: Currencies!) {
          result: accountTotalBalances(account: $account, currency: $currency) {
            totalBalances {
              chainId
              category
              totalBalance
              balances {
                address
                tokenAddress
                serviceTitle
                protocol
                iconUrl
                key
                title
                value
                share
              }
            }
          }
        }
      `,
      {
        variables: {
          account,
          currency,
        },
        models: {
          result: AccountTotalBalances,
        },
      },
    );

    return result;
  }

  async getAccountMembers(account: string, page: number): Promise<AccountMembers> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: AccountMembers;
    }>(
      gql`
        query($chainId: Int, $account: String!, $page: Int) {
          result: accountMembers(chainId: $chainId, account: $account, page: $page) {
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
      `,
      {
        variables: {
          account,
          page: page || 1,
        },
        models: {
          result: AccountMembers,
        },
      },
    );

    return result;
  }

  async getAccountSettings(): Promise<AccountSettings> {
    const { apiService, accountService } = this.services;

    const { accountAddress } = accountService;

    const { result } = await apiService.query<{
      result: AccountSettings;
    }>(
      gql`
        query($chainId: Int, $account: String!) {
          result: accountSettings(chainId: $chainId, account: $account) {
            fcmToken
            delayTransactions
          }
        }
      `,
      {
        models: {
          result: AccountSettings,
        },
        variables: {
          account: accountAddress,
        },
      },
    );

    return result;
  }

  async getDelayTransactionOptions(): Promise<number[]> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: number[];
    }>(
      gql`
        query {
          result: delayTransactionOptions
        }
      `,
    );

    return result;
  }

  async updateAccountSettings(dto: UpdateAccountSettingsDto): Promise<AccountSettings> {
    const { apiService, accountService } = this.services;

    const { accountAddress } = accountService;

    const { result } = await apiService.mutate<{
      result: AccountSettings;
    }>(
      gql`
        mutation($chainId: Int, $account: String!, $fcmToken: String, $delayTransactions: Int) {
          result: updateAccountSettings(
            chainId: $chainId
            account: $account
            fcmToken: $fcmToken
            delayTransactions: $delayTransactions
          ) {
            fcmToken
            delayTransactions
          }
        }
      `,
      {
        models: {
          result: AccountSettings,
        },
        variables: {
          account: accountAddress,
          fcmToken: dto.fcmToken,
          delayTransactions: dto.delayTransactions,
        },
      },
    );

    return result;
  }

  async isEligibleForAirdrop(dto: IsEligibleForAirdropDto): Promise<boolean> {
    const { apiService } = this.services;
    const { address } = dto;

    const { result } = await apiService.query<{
      result: boolean;
    }>(
      gql`
        query($address: String!) {
          result: isEligibleForAirdrop(address: $address)
        }
      `,
      {
        variables: {
          address,
        },
      },
    );

    return result;
  }

  protected onInit(): void {
    const { walletService, networkService } = this.services;

    this.addSubscriptions(
      combineLatest([
        walletService.walletAddress$, //
        networkService.chainId$,
      ])
        .pipe(
          map(([address, chainId]) =>
            !address || !chainId
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
