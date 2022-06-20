interface  ITranscation {
  data: string;
  to: string;
  value: string;
  from: string;
  chainId: number;
}


interface  IApprovalData {
  approvalAddress: string;
  amount: string;
}

export class MultiChainQuote {
  approvalData: IApprovalData | null;
  transaction: ITranscation;
}
