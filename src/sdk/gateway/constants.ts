export enum GatewayBatchStates {
  Queued = 'Queued',
  Delayed = 'Delayed',
  Sending = 'Sending',
  Sent = 'Sent',
  Reverted = 'Reverted',
  Canceled = 'Canceled',
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
