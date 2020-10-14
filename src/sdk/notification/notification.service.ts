import { Subject, SubscriptionLike, combineLatest } from 'rxjs';
import { gql } from '@apollo/client/core';
import { map, tap } from 'rxjs/operators';
import { Service } from '../common';
import { AnyNotification } from './classes';
import { Notification } from './interfaces';

export class NotificationService extends Service {
  readonly notification$ = new Subject<AnyNotification>();

  private subscribed = false;

  private walletSubscription: SubscriptionLike = null;
  private accountSubscription: SubscriptionLike = null;
  private subscribedAccountAddress: string = null;

  subscribeNotifications(): Subject<Notification> {
    if (!this.subscribed) {
      this.subscribed = true;

      const { walletService, accountService, networkService } = this.services;

      this.addSubscriptions(
        combineLatest([
          walletService.walletAddress$, //
          networkService.chainId$,
        ])
          .pipe(
            tap(([address, chainId]) => {
              if (address && chainId) {
                if (this.walletSubscription) {
                  this.walletSubscription.unsubscribe();
                }

                this.walletSubscription = this.createGraphQLSubscription(address);
              }
            }),
          )
          .subscribe(),

        combineLatest([
          accountService.accountAddress$, //
          networkService.chainId$,
        ])
          .pipe(
            map(([address, chainId]) => (!chainId || address === walletService.walletAddress ? null : address)),
            tap((address) => {
              if (address) {
                if (this.accountSubscription && this.subscribedAccountAddress !== address) {
                  this.accountSubscription.unsubscribe();
                  this.accountSubscription = null;
                }

                if (!this.accountSubscription) {
                  this.subscribedAccountAddress = address;
                  this.accountSubscription = this.createGraphQLSubscription(address);
                }
              } else if (this.accountSubscription) {
                this.accountSubscription.unsubscribe();
                this.accountSubscription = null;
              }
            }),
          )
          .subscribe(),
      );
    }

    return this.notification$;
  }

  protected onDestroy() {
    if (this.walletSubscription) {
      this.walletSubscription.unsubscribe();
    }

    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }

  private createGraphQLSubscription(address: string): SubscriptionLike {
    const { apiService } = this.services;
    const observable = apiService.subscribe<{
      notification: AnyNotification;
    }>(
      gql`
        subscription($chainId: Int, $address: String!) {
          notification: newNotification(chainId: $chainId, address: $address) {
            type
            recipient
            payload
          }
        }
      `,
      {
        variables: {
          address,
        },
        models: {
          notification: AnyNotification,
        },
      },
    );

    return observable
      .map(({ notification }) => notification)
      .subscribe((notification) => {
        this.notification$.next(notification);
      });
  }
}
