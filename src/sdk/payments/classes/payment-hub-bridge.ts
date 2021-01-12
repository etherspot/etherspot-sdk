import { Type } from 'class-transformer';
import { prepareNetworkName } from '../../network';
import { PaymentHubBridgeStates } from '../constants';
import { PaymentHub } from './payment-hub';

export class PaymentHubBridge {
  @Type(() => PaymentHub)
  hub: Partial<PaymentHub>;

  state: PaymentHubBridgeStates;

  acceptedChainId: number;

  acceptedToken: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;

  get acceptedNetworkName(): string {
    return prepareNetworkName(this.acceptedChainId);
  }
}
