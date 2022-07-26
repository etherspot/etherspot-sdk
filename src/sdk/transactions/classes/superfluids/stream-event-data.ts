import { BaseClass, TransformBigNumber } from '../../../common';
import { BigNumber } from 'ethers';

export class StreamEventData extends BaseClass<StreamEventData> {
    id: string;

    blockNumber: number;

    timestamp: number;

    transactionHash: string;

    token: string;

    sender: string;

    receiver: boolean;

    @TransformBigNumber()
    flowRate: BigNumber;

    @TransformBigNumber()
    totalSenderFlowRate: BigNumber;

    @TransformBigNumber()
    totalReceiverFlowRate: BigNumber;

    userData: string;

    @TransformBigNumber()
    oldFlowRate: BigNumber;

    type: number;

    @TransformBigNumber()
    totalAmountStreamedUntilTimestamp: BigNumber;
}