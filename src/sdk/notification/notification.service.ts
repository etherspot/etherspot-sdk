import { Subject, SubscriptionLike } from 'rxjs';
import { gql } from '@apollo/client/core';
import { map, tap } from 'rxjs/operators';
import { Service } from '../common';
import { Notification } from './classes';

export class NotificationService extends Service {
  readonly notification$ = new Subject<Notification>();

  private subscribed = false;

  private walletSubscription: SubscriptionLike = null;
  private accountSubscription: SubscriptionLike = null;
  private subscribedAccountAddress: string = null;

  subscribeNotifications(): Subject<Notification> {
    if (!this.subscribed) {
      this.subscribed = true;

      const { walletService, accountService } = this.services;

      this.addSubscriptions(
        walletService.address$
          .pipe(
            tap((address) => {
              if (address) {
                if (this.walletSubscription) {
                  this.walletSubscription.unsubscribe();
                }

                this.walletSubscription = this.createGraphQLSubscription(address);
              }
            }),
          )
          .subscribe(),
        accountService.accountAddress$
          .pipe(
            map((address) => (address === walletService.address ? null : address)),
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

  private createGraphQLSubscription(address: string): SubscriptionLike {
    const { apiService } = this.services;
    const observable = apiService.subscribe<{
      notification: Notification;
    }>(
      gql`
        subscription($address: String!) {
          notification: newNotification(address: $address) {
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
          notification: Notification,
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
