import { BaseNotification } from '../interfaces';

export class AnyNotification implements BaseNotification {
  type: any;

  recipient: string;

  payload: any;
}
