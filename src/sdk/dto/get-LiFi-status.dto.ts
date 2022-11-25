import { IsNumber } from "class-validator";

export class GetLiFiStatusDto {
    txnHash: string;

    bridge?: string;

    @IsNumber()
    fromChainId: number;

    @IsNumber()
    toChainId: number;
}