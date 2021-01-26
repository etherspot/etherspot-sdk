import { Subject } from 'rxjs';
import { mockService } from '../../../testing';

const notification$ = new Subject<any>();

export const NotificationService = mockService({
  notification$,
  subscribeNotifications: jest.fn(() => notification$),
});
