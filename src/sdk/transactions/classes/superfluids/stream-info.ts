import { BaseClass, TransformBigNumber } from '../../../common';
import { Type } from 'class-transformer';
import { BigNumber } from 'ethers';
import { StreamEventData } from './stream-event-data';
import { StreamTokenData } from './stream-token-data';

export class StreamInfo extends BaseClass<StreamInfo> {
    id: string;

    @TransformBigNumber()
    currentFlowRate: BigNumber;

    createdAtTimestamp: number;

    createdAtBlockNumber: number;

    updatedAtTimestamp: number;

    updatedAtBlockNumber: number;

    @TransformBigNumber()
    streamedUntilUpdatedAt: BigNumber;

    token: StreamTokenData;

    sender: string;

    receiver: string;

    @Type(() => StreamEventData)
    flowUpdatedEvents: StreamEventData[];
}