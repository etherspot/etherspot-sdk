import { IsOptional } from 'class-validator';
import { BigNumber } from 'ethers';
import { IsAddress, IsBigNumberish } from './validators';

export class CreateStreamTransactionPayloadDto {
    @IsOptional()
    @IsAddress()
    account?: string = null;

    @IsAddress()
    receiver: string;

    @IsAddress()
    tokenAddress: string;

    @IsBigNumberish()
    amount: BigNumber;

    @IsOptional()
    userData?: string;

    @IsOptional()
    skipBalanceCheck?: boolean;
}
