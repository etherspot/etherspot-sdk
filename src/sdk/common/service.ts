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

      this.removeSubscriptions();

      if (this.onDestroy) {
        this.onDestroy();
      }
    }
  }

  protected onInit?(): void;

  protected onDestroy?(): void;

  protected get contracts(): Context['contracts'] {
    return this.context.contracts;
  }

  protected get services(): Context['services'] {
    return this.context.services;
  }

  protected addSubscriptions(...subscriptions: Subscription[]): void {
    this.subscriptions.push(...subscriptions.filter((subscription) => !!subscription));
  }

  protected removeSubscriptions(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }

  protected replaceSubscriptions(...subscriptions: Subscription[]): void {
    this.removeSubscriptions();
    this.addSubscriptions(...subscriptions);
  }
}
