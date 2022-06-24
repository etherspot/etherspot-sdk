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

export class MultiChainQuote {
  provider: string;
  approvalData: IApprovalData | null;
  transaction: ITranscation;
}

export class BridgingQuotes {
  items: MultiChainQuote[];
}
