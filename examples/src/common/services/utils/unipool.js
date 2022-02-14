// @flow
/*
    Pillar Wallet: the personal data locker
    Copyright (C) 2019 Stiftung Pillar Project

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

// constants
import { ETH } from 'constants/assetsConstants';
import { CHAIN } from 'constants/chainConstants';

// utils
import {
  parseTokenBigNumberAmount,
  formatUnits,
  reportErrorLog,
} from 'utils/common';

// services
import { buildERC20ApproveTransactionData, encodeContractMethod } from 'services/assets';
import etherspotService from 'services/etherspot';

// abi
import UNIPOOL_CONTRACT from 'abi/unipoolPool.json';
import ERC20_CONTRACT_ABI from 'abi/erc20.json';

// types
import type { Asset } from 'models/Asset';
import type { EtherspotUnipoolInterface } from 'models/Etherspot';


export const getStakedAmount = async (unipoolAddress: string, userAddress: string): Promise<?string> => {
  const unipoolContract = etherspotService.getContract<?EtherspotUnipoolInterface>(
    CHAIN.ETHEREUM,
    UNIPOOL_CONTRACT,
    unipoolAddress,
  );

  if (!unipoolContract) {
    reportErrorLog('getStakedAmount failed: no unipoolContract', { unipoolAddress });
    return null;
  }

  try {
    const balanceBN = await unipoolContract.callBalanceOf(userAddress);
    return balanceBN ? formatUnits(balanceBN, 18) : null;
  } catch (error) {
    reportErrorLog('getStakedAmount failed: callBalanceOf failed', { unipoolAddress, error });
    return null;
  }
};

export const getEarnedAmount = async (unipoolAddress: string, userAddress: string): Promise<?string> => {
  const unipoolContract = etherspotService.getContract<?EtherspotUnipoolInterface>(
    CHAIN.ETHEREUM,
    UNIPOOL_CONTRACT,
    unipoolAddress,
  );

  if (!unipoolContract) {
    reportErrorLog('getEarnedAmount failed: no unipoolContract', { unipoolAddress });
    return null;
  }

  try {
    const earnedBN = await unipoolContract.callEarned(userAddress);
    return earnedBN ? formatUnits(earnedBN, 18) : null;
  } catch (error) {
    reportErrorLog('getEarnedAmount failed: callEarned failed', { unipoolAddress, error });
    return null;
  }
};

export const getStakeTransactions = async (
  unipoolAddress: string,
  sender: string,
  amount: string,
  token: Asset,
): Promise<Object[]> => {
  const tokenAmountBN = parseTokenBigNumberAmount(amount, token.decimals);

  const stakeTransactionData = encodeContractMethod(UNIPOOL_CONTRACT, 'stake', [
    tokenAmountBN,
  ]);

  let stakeTransactions = [{
    from: sender,
    to: unipoolAddress,
    data: stakeTransactionData,
    amount: 0,
    symbol: ETH,
  }];

  const erc20Contract = etherspotService.getContract(CHAIN.ETHEREUM, ERC20_CONTRACT_ABI, token.address);
  if (!erc20Contract) {
    reportErrorLog('getStakeTransactions failed: no erc20Contract', { token });
    return stakeTransactions;
  }

  let approvedAmountBN;
  try {
    approvedAmountBN = await erc20Contract.callAllowance(sender, unipoolAddress);
  } catch (error) {
    reportErrorLog('getStakeTransactions: callAllowance failed', { token, error });
  }

  if (!approvedAmountBN || tokenAmountBN.gt(approvedAmountBN)) {
    const approveTransactionData =
      buildERC20ApproveTransactionData(unipoolAddress, amount, token.decimals);
    stakeTransactions = [
      {
        from: sender,
        to: token.address,
        data: approveTransactionData,
        amount: 0,
        symbol: ETH,
      },
      ...stakeTransactions,
    ];
  }
  return stakeTransactions;
};

export const getUnstakeTransaction = (
  unipoolAddress: string,
  sender: string,
  amount: string,
) => {
  const tokenAmountBN = parseTokenBigNumberAmount(amount, 18);
  const unstakeTransactionData = encodeContractMethod(UNIPOOL_CONTRACT, 'withdraw', [
    tokenAmountBN,
  ]);

  return {
    from: sender,
    to: unipoolAddress,
    data: unstakeTransactionData,
    amount: 0,
    symbol: ETH,
  };
};

export const getClaimRewardsTransaction = (
  unipoolAddress: string,
  sender: string,
) => {
  const getRewardTransactionData = encodeContractMethod(UNIPOOL_CONTRACT, 'getReward', []);

  return {
    from: sender,
    to: unipoolAddress,
    data: getRewardTransactionData,
    amount: 0,
    symbol: ETH,
  };
};
