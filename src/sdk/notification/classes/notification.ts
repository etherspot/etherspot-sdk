import { Synchronized } from '../../common';
import { NotificationTypes } from '../constants';

export class Notification extends Synchronized {
  type: NotificationTypes;

  recipient: string;

  payload: string;
}
