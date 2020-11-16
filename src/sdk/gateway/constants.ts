export const GATEWAY_ESTIMATION_AMOUNT = 1;

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
