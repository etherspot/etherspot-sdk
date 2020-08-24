import { EstimatedRelayedTransaction } from './classes';

export interface Batch {
  requests: {
    to: string;
    data: string;
  }[];
  estimation: EstimatedRelayedTransaction;
}
