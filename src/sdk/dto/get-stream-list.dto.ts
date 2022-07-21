import { IsOptional } from 'class-validator';
import { IsAddress } from './validators';

export class GetStreamListDto {
    @IsOptional()
    @IsAddress()
    account?: string;
}