import { Type } from 'class-transformer';
import { CrossChainTransactionRequest } from './exchange-cross-chain';

export interface Data {
  fromToken: Token;
  toToken: Token;
  toTokenAmount: string;
  fromTokenAmount: string;
  protocols: {
    name: string;
    part: number;
    fromTokenAddress: string;
    toTokenAddress: string;
  }[][];
  estimatedGas: number;
  amountOut: string;
  rate: string;
  priceImpact: string;
  requiredLiquidity: string;
  lpFees: string;
  adjustedBonderFee: string;
  adjustedDestinationTxFee: string;
  totalFee: string;
  estimatedReceived: string;
}
export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  name: string;
  coinKey: string;
  priceUSD: string;
  logoURI: string;
}

export interface GasCost {
  type: string;
  price: string;
  estimate: string;
  limit: string;
  amount: string;
  amountUSD: string;
  token: Token;
}

export interface Estimate {
  fromAmount: string;
  toAmount: string;
  toAmountMin: string;
  approvalAddress: string;
  gasCosts: GasCost[];
  executionDuration: number;
  fromAmountUSD: string;
  toAmountUSD: string;
  data: Data;
}

export interface Action {
  fromChainId: number;
  fromAmount: string;
  fromToken: Token;
  fromAddress: string;
  toChainId: number;
  toToken: Token;
  toAddress: string;
  slippage: number;
}
export class CrossChainQuote {
  id: string;

  action: Action;

  estimate: Estimate;

  @Type(() => CrossChainTransactionRequest)
  transactionRequest: CrossChainTransactionRequest;
}
