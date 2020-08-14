import { OperatorFunction } from 'rxjs';
import { distinctUntilKeyChanged, pluck, map } from 'rxjs/operators';
import { deepCompare } from '../utils';

/**
 * @ignore
 */
export function distinctUniqueKey<T, K extends keyof T>(key: K): OperatorFunction<T, T[K]> {
  return (input$) =>
    input$.pipe(
      map((value) => {
        return (value ? value : { [key]: null }) as T;
      }),
      distinctUntilKeyChanged(key, deepCompare),
      pluck(key),
    );
}
