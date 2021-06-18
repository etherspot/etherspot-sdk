export enum GatewayBatchStates {
  Queued = 'Queued',
  Sending = 'Sending',
  Sent = 'Sent',
  Reverted = 'Reverted',
}

export enum GatewayTransactionStates {
  Sending = 'Sending',
  Sent = 'Sent',
  Canceling = 'Canceling',
  Canceled = 'Canceled',
  Reverted = 'Reverted',
}

export enum GatewayKnownOps {
  WithdrawP2PDeposit = 'WithdrawP2PDeposit',
}
