import { Subject, PartialObserver, Subscription } from 'rxjs';
import { Observable } from '@apollo/client/core';

export class GraphGLSubject<T> extends Subject<T> {
  constructor(private observable: Observable<T>) {
    super();
  }

  subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription;
  subscribe(observer?: PartialObserver<T>): Subscription;
  subscribe(...args: any[]): Subscription {
    const result = super.subscribe(...args);
    const unsubscribe = result.unsubscribe.bind(result);
    const subscription = this.observable.subscribe(this);

    result.unsubscribe = (...args: any[]) => {
      subscription.unsubscribe();
      return unsubscribe(...args);
    };

    return result;
  }
}
