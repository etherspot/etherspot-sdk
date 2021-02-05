/**
 * @ignore
 */
export class BaseClass<T> {
  constructor(raw?: Partial<T>) {
    if (raw) {
      Object.assign(this, raw);
    }
  }
}
