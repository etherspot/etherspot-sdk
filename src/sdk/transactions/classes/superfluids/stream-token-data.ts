import { BaseClass } from '../../../common';

export class StreamTokenData extends BaseClass<StreamTokenData> {
    id: string;

    createdAtTimestamp: number;

    createdAtBlockNumber: number;

    name: string;

    symbol: string;

    isListed: boolean;

    underlyingAddress: string;
}