import { Synchronized } from '../classes';
import { ObjectSubject } from './object.subject';

/**
 * @ignore
 */
export class SynchronizedSubject<T extends Synchronized, K extends keyof T = keyof T> extends ObjectSubject<T, K> {
  prepareForCompare(value: T): any {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { synchronizedAt, ...data } = value;
    return data;
  }

  prepareForNext(value: T): T {
    if (value !== null && value.synchronizedAt !== null) {
      value.synchronizedAt = new Date();
    }

    return value;
  }
}
