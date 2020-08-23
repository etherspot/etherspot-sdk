import { Subscription } from 'rxjs';
import { Context } from '../context';

export abstract class Service {
  protected context: Context;
  private inited = false;
  private destroyed = false;
  private subscriptions: Subscription[] = [];

  init(context: Context): void {
    if (!this.inited) {
      this.inited = true;
      this.context = context;

      if (this.onInit) {
        this.onInit();
      }
    }
  }

  destroy(): void {
    if (!this.destroyed) {
      this.destroyed = true;

      for (const subscription of this.subscriptions) {
        subscription.unsubscribe();
      }

      this.subscriptions = [];

      if (this.onDestroy) {
        this.onDestroy();
      }
    }
  }

  protected onInit?(): void;

  protected onDestroy?(): void;

  protected get network(): Context['network'] {
    return this.context.network;
  }

  protected get contracts(): Context['contracts'] {
    return this.context.contracts;
  }

  protected get services(): Context['services'] {
    return this.context.services;
  }

  protected addSubscriptions(...subscription: Subscription[]): void {
    this.subscriptions.push(...subscription);
  }
}
