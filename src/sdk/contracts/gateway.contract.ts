import { ContractNames } from '@etherspot/contracts';
import { TransactionRequest } from '../common';
import { Contract } from './contract';
import { GatewayFunctionsNames } from './constants';

export class GatewayContract extends Contract<GatewayFunctionsNames> {
  constructor() {
    super(ContractNames.Gateway);
  }

  encodeSendBatchFromAccount(account: string, to: string[], data: string[]): TransactionRequest {
    return this.encodeSelfContractTransactionRequest(
      GatewayFunctionsNames.SendBatchFromAccount, //
      account,
      to,
      data,
    );
  }

  encodeDelegateBatchWithoutGasPriceFromAccount(
    account: string,
    to: string[],
    data: string[],
    senderSignature: string,
  ): TransactionRequest {
    return this.encodeSelfContractTransactionRequest(
      GatewayFunctionsNames.DelegateBatchWithoutGasPriceFromAccount, //
      account,
      to,
      data,
      senderSignature,
    );
  }
}
