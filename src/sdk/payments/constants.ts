export enum PaymentStates {
  Created = 'Created',
  Expired = 'Expired',
  Committed = 'Committed',
}

export enum PaymentChannelStates {
  Opened = 'Opened',
  Endangered = 'Endangered',
}

export enum PaymentDepositStates {
  Locked = 'Locked',
  Unlocked = 'Unlocked',
}
