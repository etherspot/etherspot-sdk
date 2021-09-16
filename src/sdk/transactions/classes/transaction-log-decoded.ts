import { DecodedLogParam } from './decoded-log-param';

export class TransactionLogDecoded {
  name: string;

  signature: string;

  params: DecodedLogParam[];
}
