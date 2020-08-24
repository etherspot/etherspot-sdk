export interface TransactionRequest {
  to: string;
  data: string;
}

export interface WalletLike {
  privateKey: string;
}
