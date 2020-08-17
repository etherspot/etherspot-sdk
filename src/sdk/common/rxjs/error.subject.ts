import { Subject } from 'rxjs';

/**
 * @ignore
 */
export class ErrorSubject extends Subject<any> {
  complete(): void {
    //
  }

  next(value?: any): void {
    if (value) {
      super.next(value);
    }
  }

  wrap<T>(func: () => T): T {
    let result: any;

    try {
      result = func();

      if (result instanceof Promise) {
        result = result.catch((err) => {
          this.next(err);
          return null;
        });
      }
    } catch (err) {
      this.next(err);
      result = null;
    }

    return result;
  }

  catch<T>(func: () => T): void {
    try {
      const promise = func();

      if (promise instanceof Promise) {
        promise.catch((err) => {
          this.next(err);
        });
      }
    } catch (err) {
      this.next(err);
    }
  }
}
