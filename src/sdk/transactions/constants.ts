export enum TransactionStatuses {
  Pending = 'Pending',
  Completed = 'Completed',
  Reverted = 'Reverted',
}

export enum TransactionAssetCategories {
  External = 'external',
  Internal = 'internal',
  Token = 'token',
}

export enum TransactionDirections {
  Sender = 'Sender',
  Receiver = 'Receiver',
}

export enum TokenTypes {
  Erc20 = 'Erc20',
  Erc721 = 'Erc721',
  Erc1155 = 'Erc1155',
  Native = 'Native',
}
