import { TransactionLogDecoded } from './transaction-log-decoded';

export class TransactionLog {
  address: string;

  topics: string[];

  data: string;

  decoded?: TransactionLogDecoded;
}
