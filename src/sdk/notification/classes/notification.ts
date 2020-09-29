import { WithTypename } from '../../common';
import { NotificationTypes } from '../constants';

export class Notification extends WithTypename {
  type: NotificationTypes;

  recipient: string;

  payload: string;
}
