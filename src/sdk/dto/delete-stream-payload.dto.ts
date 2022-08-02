import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class DeleteStreamTransactionPayloadDto {
    @IsOptional()
    @IsAddress()
    account?: string = null;

    @IsAddress()
    receiver: string;

    @IsAddress()
    tokenAddress: string;

    @IsOptional()
    userData?: string = null;

    @IsOptional()
    skipBalanceCheck?: boolean;
}
