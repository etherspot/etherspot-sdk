import { utils } from 'ethers';

export const PAYMENT_HUB_P2P_CHANNEL_UID = utils.id('PAYMENT_HUB_P2P_CHANNEL_ID');

export const DEFAULT_PAYMENT_CHANNEL_UID_SALT = 'default';

export enum P2PPaymentChannelStates {
  Opened = 'Opened',
  Signed = 'Signed',
  Endangered = 'Endangered',
}

export enum P2PPaymentChannelPaymentStates {
  Created = 'Created',
  Signed = 'Signed',
  Expired = 'Expired',
  Committed = 'Committed',
}

export enum P2PPaymentDepositStates {
  Locked = 'Locked',
  Unlocked = 'Unlocked',
}

export enum BatchCommitP2PPaymentChannelModes {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}
