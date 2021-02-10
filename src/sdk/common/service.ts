import { Subscription } from 'rxjs';
import { Context } from '../context';

export abstract class Service {
  protected context: Context;
  private inited = false;
  private destroyed = false;
  private attachedCounter = 0;
  private subscriptions: Subscription[] = [];

  init(context: Context): void {
    if (!this.inited) {
      this.inited = true;
      this.context = context;

      if (this.onInit) {
        this.onInit();
      }

      if (this.error$) {
        this.addSubscriptions(this.error$.subscribe());
      }
    }

    ++this.attachedCounter;
  }

  destroy(): void {
    if (!this.attachedCounter) {
      return;
    }

    --this.attachedCounter;

    if (!this.attachedCounter && !this.destroyed) {
      this.destroyed = true;

      this.removeSubscriptions();

      if (this.onDestroy) {
        this.onDestroy();
      }
    }
  }

  protected onInit?(): void;

  protected onDestroy?(): void;

  protected get error$(): Context['error$'] {
    return this.context.error$;
  }

  protected get internalContracts(): Context['internalContracts'] {
    return this.context.internalContracts;
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
