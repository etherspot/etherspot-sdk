import { Observable, BehaviorSubject } from 'rxjs';
import { deepCompare } from '../utils';
import { distinctUniqueKey } from './distinct-unique-key.operator';

/**
 * @ignore
 */
export class ObjectSubject<T extends {}, K extends keyof T = keyof T> extends BehaviorSubject<T> {
  constructor(value: T = null) {
    super(value);
  }

  observeKey<R = T[K]>(key: K): Observable<R> {
    return this.pipe<any>(distinctUniqueKey(key));
  }

  next(value: T): void {
    if (!value) {
      super.next(null);
    } else if (
      !this.value || //
      !deepCompare(this.prepareForCompare(this.value), this.prepareForCompare(value))
    ) {
      super.next(this.prepareForNext(value));
    }
  }

  prepareForNext(value: T): T {
    return value;
  }

  prepareForCompare(value: T): any {
    return value;
  }
}
