import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { GatewaySubmittedBatch } from './gateway-submitted-batch';

export class GatewaySubmittedBatches extends PaginationResult<GatewaySubmittedBatch> {
  @Type(() => GatewaySubmittedBatch)
  items: GatewaySubmittedBatch[];
}
