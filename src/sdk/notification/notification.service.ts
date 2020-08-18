import { Observable } from 'rxjs';
import { gql } from '@apollo/client/core';
import { map } from 'rxjs/operators';
import { Service, GraphGLSubject } from '../common';
import { Notification } from './classes';

export class NotificationService extends Service {
  subscribeNotifications(): Observable<Notification> {
    const { apiService, accountService } = this.services;

    const address = accountService.accountAddress;

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

    return new GraphGLSubject(observable).pipe(map(({ notification }) => notification));
  }
}
