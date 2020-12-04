export enum GatewayBatchStates {
  Queued = 'Queued',
  Sending = 'Sending',
  Sent = 'Sent',
  Reverted = 'Reverted',
  Resending = 'Resending',
}

export enum GatewayTransactionStates {
  Sending = 'Sending',
  Sent = 'Sent',
  Canceling = 'Canceling',
  Canceled = 'Canceled',
  Reverted = 'Reverted',
}
