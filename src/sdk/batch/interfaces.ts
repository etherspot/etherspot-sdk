import { TransactionRequest } from '../common';
import { EstimatedRelayedTransaction } from './classes';

export interface Batch {
  requests: TransactionRequest[];
  estimation: EstimatedRelayedTransaction;
}
