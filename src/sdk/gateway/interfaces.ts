import { GatewayEstimatedBatch } from './classes';

export interface GatewayBatch {
  requests: {
    to: string;
    data: string;
  }[];
  estimation: GatewayEstimatedBatch;
}
