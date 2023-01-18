import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../common';

export class AccountInvestmentPositionsInfo {
    label: string;

    @TransformBigNumber()
    balance: BigNumber;

    tokens: number;

    price: number;

    metaType: string;

    name: string;

    logoURI: string;
}
