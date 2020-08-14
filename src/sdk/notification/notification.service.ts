import { Subject } from 'rxjs';
import { gql } from '@apollo/client/core';
import { Service, GraphGLSubject } from '../common';
import { Notification } from './classes';

export class NotificationService extends Service {
  subscribeNotifications(): Subject<Notification> {
    const { apiService, accountService } = this.services;

    const address = accountService.accountAddress;

    const observable = apiService.subscribe(
      gql`
        subscription($address: String!) {
          output: newNotification(address: $address) {
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
        Model: Notification,
      },
    );

    return new GraphGLSubject(observable);
  }
}
