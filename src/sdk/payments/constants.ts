import { utils } from 'ethers';

export const PAYMENT_HUB_P2P_CHANNEL_UID = utils.id('PAYMENT_HUB_P2P_CHANNEL_ID');

export const DEFAULT_PAYMENT_CHANNEL_UID_SALT = 'default';

export enum P2PPaymentChannelStates {
  Opened = 'Opened',
  Signed = 'Signed',
}

export enum P2PPaymentChannelPaymentStates {
  Reserved = 'Reserved',
  Signed = 'Signed',
  Expired = 'Expired',
  Committed = 'Committed',
}

export enum P2PPaymentDepositWithdrawalStates {
  Signed = 'Signed',
  Withdrawn = 'Withdrawn',
}

export enum P2PPaymentDepositExitStates {
  Requested = 'Requested',
  Rejected = 'Rejected',
  Completed = 'Completed',
}

export enum PaymentHubBridgeStates {
  Active = 'Active',
  Inactive = 'Inactive',
}
