import { Subscription } from 'rxjs';
import { Context } from '../context';

export abstract class Service {
  protected context: Context;

  init(context: Context): void {
    this.context = context;

    if (this.onInit) {
      this.onInit();
    }
  }

  protected onInit?(): void;

  protected get network(): Context['network'] {
    return this.context.network;
  }

  protected get contracts(): Context['contracts'] {
    return this.context.contracts;
  }

  protected get services(): Context['services'] {
    return this.context.services;
  }

  protected addSubscription(subscription: Subscription): void {
    return this.context.addSubscription(subscription);
  }
}
