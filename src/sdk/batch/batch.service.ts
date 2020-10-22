import { BigNumber, utils } from 'ethers';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service, UniqueSubject, TransactionRequest } from '../common';
import { RelayedTransaction } from '../relayer';
import { Batch } from './interfaces';

export class BatchService extends Service {
  readonly batch$ = new UniqueSubject<Batch>(null);

  get batch(): Batch {
    return this.batch$.value;
  }

  pushTransactionRequest(transactionRequest: TransactionRequest): Batch {
    const { to, data } = transactionRequest;

    const batch: Batch = {
      requests: [],
      ...(this.batch || {}),
      estimation: null,
    };

    batch.requests.push({
      to,
      data: utils.hexlify(data),
    });

    this.batch$.next(batch);

    return this.batch;
  }

  clearBatch(): void {
    this.batch$.next(null);
  }

  async estimateBatch(refundToken: string = null): Promise<Batch> {
    if (!this.batch) {
      throw new Error('Can not estimate empty batch');
    }

    const { relayerService } = this.services;

    const { to, data } = this.extractRequests();

    const estimatedRelayedTransaction = await relayerService.estimatedRelayedTransaction(to, data, refundToken);

    this.batch$.next({
      ...this.batch,
      estimation: {
        ...estimatedRelayedTransaction,
      },
    });

    return this.batch;
  }

  async submitBatch(gasPrice: BigNumber = null): Promise<RelayedTransaction> {
    if (!this.batch) {
      throw new Error('Can not submit empty batch');
    }

    if (!this.batch.estimation) {
      throw new Error('Can not submit not estimated batch');
    }

    const { personalAccountRegistryContract } = this.contracts;
    const { accountService, relayerService } = this.services;

    const { estimation } = this.batch;

    if (!gasPrice) {
      gasPrice = estimation.gasPrice;
    } else if (gasPrice.lt(estimation.gasPrice)) {
      throw new Error('Custom gas price is too low');
    }

    const refundTransactionRequest = personalAccountRegistryContract.encodeRefundAccountCall(
      accountService.accountAddress,
      estimation.refundToken,
      estimation.refundAmount,
    );

    const { to, data } = this.extractRequests();

    let result: RelayedTransaction = null;

    try {
      result = await relayerService.sendRelayedTransaction(
        [...to, refundTransactionRequest.to],
        [...data, refundTransactionRequest.data],
        gasPrice,
      );

      this.clearBatch();
    } catch (err) {
      throw err;
    }

    return result;
  }

  async encodeBatch(delegate: boolean): Promise<TransactionRequest> {
    if (!this.batch) {
      throw new Error('Can not encode empty batch');
    }
    const { relayerService } = this.services;

    const { to, data } = this.extractRequests();

    return relayerService.encodeRelayedTransaction(to, data, delegate);
  }

  protected onInit() {
    const { accountService, networkService } = this.services;

    this.addSubscriptions(
      combineLatest([
        accountService.accountAddress$, //
        networkService.chainId$,
      ])
        .pipe(
          map(() => null), //
        )
        .subscribe(this.batch$),
    );
  }

  private extractRequests(): { to: string[]; data: string[] } {
    const to: string[] = [];
    const data: string[] = [];

    for (const request of this.batch.requests) {
      to.push(request.to);
      data.push(request.data);
    }

    return {
      to,
      data,
    };
  }
}
