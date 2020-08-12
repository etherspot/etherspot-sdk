import { Context } from './context';

export abstract class AbstractService {
  protected context: Context;

  init(context: Context): void {
    this.context = context;

    if (this.onInit) {
      this.onInit();
    }
  }

  protected onInit?(): void;
}
