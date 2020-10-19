import { WithTypename } from '../../common';
import { BaseNotification } from '../interfaces';

export class AnyNotification extends WithTypename implements BaseNotification<any, any> {
  type: any;

  recipient: string;

  payload: any;
}
