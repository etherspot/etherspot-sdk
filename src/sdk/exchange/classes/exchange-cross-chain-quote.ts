import { Type } from 'class-transformer';
import { CrossChainTransactionRequest } from './exchange-cross-chain';


export class CrossChainQuote {
  id:string;

  @Type(() => CrossChainTransactionRequest)
  transactionRequest: CrossChainTransactionRequest;
}
