interface ITranscation {
  data: string;
  to: string;
  value: string;
  from: string;
  chainId: number;
}

interface IApprovalData {
  approvalAddress: string;
  amount: string;
}

interface Token {
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  name: string;
  logoURI: string;
}

interface GasCost {
  limit: string;
  amountUSD: string;
  token: Token;
}

interface Data {
  fromToken: Token;
  toToken: Token;
  toTokenAmount: string;
  fromTokenAmount: string;
  estimatedGas: string;
}
interface IEstimate {
  fromAmount: string;
  toAmount: string;
  toAmountMin: string;
  approvalAddress: string;
  gasCosts: GasCost;
  data: Data;
}
export class BridgingQuote {
  provider: string;
  approvalData: IApprovalData | null;
  transaction: ITranscation;
  estimate: IEstimate;
  LiFiBridgeUsed?: string | null;
}

export class BridgingQuotes {
  items: BridgingQuote[];
}
