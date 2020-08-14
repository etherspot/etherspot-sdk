import { BehaviorSubject } from 'rxjs';
import { deepCompare } from '../utils';

/**
 * @ignore
 */
export class UniqueSubject<T = any> extends BehaviorSubject<T> {
  constructor(value: T = null) {
    super(value);
  }

  next(value: T): void {
    if (!deepCompare(this.value, value)) {
      super.next(value);
    }
  }
}
