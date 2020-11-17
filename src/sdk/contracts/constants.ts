export enum ENSControllerFunctionsNames {
  SetAddr = 'setAddr',
  RegisterSubNode = 'registerSubNode',
}

export enum ERC20TokenFunctionsNames {
  Transfer = 'transfer',
  TransferFrom = 'transferFrom',
  Approve = 'approve',
}

export enum GatewayFunctionsNames {
  SendBatchFromAccount = 'sendBatchFromAccount',
  DelegateBatch = 'delegateBatch',
}

export enum PaymentRegistryFunctionsNames {
  DeployDepositAccount = 'deployDepositAccount',
  WithdrawDeposit = 'withdrawDeposit',
  CommitPaymentChannelAndWithdraw = 'commitPaymentChannelAndWithdraw',
  CommitPaymentChannelAndDeposit = 'commitPaymentChannelAndDeposit',
  CommitPaymentChannelAndSplit = 'commitPaymentChannelAndSplit',
}

export enum PersonalAccountRegistryFunctionsNames {
  AddAccountOwner = 'addAccountOwner',
  RemoveAccountOwner = 'removeAccountOwner',
  ExecuteAccountTransaction = 'executeAccountTransaction',
  RefundAccountCall = 'refundAccountCall',
}
