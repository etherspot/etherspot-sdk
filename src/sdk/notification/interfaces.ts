import { NotificationTypes } from './constants';

export interface BaseNotification<T = any, P = any> {
  type: T;
  recipient: string;
  payload: P;
}

export type AccountNotification = BaseNotification<
  NotificationTypes.AccountUpdated,
  {
    account: string;
  }
>;

export type AccountMemberNotification = BaseNotification<
  NotificationTypes.AccountMemberCreated | NotificationTypes.AccountMemberUpdated,
  {
    account: string;
    member: string;
  }
>;

export type ENSNodeNotification = BaseNotification<
  NotificationTypes.ENSNodeCreated | NotificationTypes.ENSNodeUpdated,
  {
    hash: string;
  }
>;

export type GatewayBatchNotification = BaseNotification<
  NotificationTypes.GatewayBatchCreated | NotificationTypes.GatewayBatchUpdated,
  {
    hash: string;
  }
>;

export type P2PPaymentChannelNotification = BaseNotification<
  NotificationTypes.P2PPaymentChannelCreated | NotificationTypes.P2PPaymentChannelUpdated,
  {
    hash: string;
  }
>;

export type P2PPaymentDepositNotification = BaseNotification<
  NotificationTypes.P2PPaymentDepositCreated | NotificationTypes.P2PPaymentDepositUpdated,
  {
    hash: string;
  }
>;

export type PaymentHubNotification = BaseNotification<
  NotificationTypes.PaymentHubCreated | NotificationTypes.PaymentHubUpdated,
  {
    hub: string;
    token: string;
  }
>;

export type PaymentHubBridgeNotification = BaseNotification<
  NotificationTypes.PaymentHubBridgeCreated | NotificationTypes.PaymentHubBridgeUpdated,
  {
    hub: string;
    token: string;
    acceptedChainId: number;
    acceptedToken: string;
  }
>;

export type PaymentHubDepositNotification = BaseNotification<
  NotificationTypes.PaymentHubDepositCreated | NotificationTypes.PaymentHubDepositUpdated,
  {
    hub: string;
    token: string;
    owner: string;
  }
>;

export type PaymentHubPaymentNotification = BaseNotification<
  NotificationTypes.PaymentHubPaymentCreated,
  {
    hash: string;
  }
>;

export type TransactionUpdatedNotification = BaseNotification<
  NotificationTypes.TransactionUpdated,
  {
    hash: string;
  }
>;

export type Notification =
  | AccountNotification
  | AccountMemberNotification
  | ENSNodeNotification
  | GatewayBatchNotification
  | P2PPaymentChannelNotification
  | P2PPaymentDepositNotification
  | PaymentHubNotification
  | PaymentHubBridgeNotification
  | PaymentHubDepositNotification
  | PaymentHubPaymentNotification
  | TransactionUpdatedNotification;
