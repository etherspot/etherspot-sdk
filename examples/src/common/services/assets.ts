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
import ethers, { utils, BigNumber as EthersBigNumber, Wallet } from 'ethers';
import { getEnv } from './configs/envConfig';
import {isEmpty} from 'lodash';

// constants
import { ETH } from './constants/assetsConstants';
import { ERC721_TRANSFER_METHODS, ERROR_TYPE } from './constants/transactionsConstants';

// utils
import {
  getEthereumProvider,
  parseTokenBigNumberAmount
} from './utils/common';
import { nativeAssetPerChain } from './utils/chains';
import { addressesEqual } from './utils/assets';

// abis
import ERC20_CONTRACT_ABI from './abi/erc20.json';
import ERC721_CONTRACT_ABI_TRANSFER from './abi/erc721_transfer.json';
import ERC721_CONTRACT_ABI_SAFE_TRANSFER_FROM from './abi/erc721_safeTransferFrom.json';
import ERC721_CONTRACT_ABI_TRANSFER_FROM from './abi/erc721_transferFrom.json';

// services
// import {
//   getCoinGeckoTokenPrices,
//   getCoinGeckoPricesByCoinId,
//   chainToCoinGeckoCoinId,
// } from 'services/coinGecko';

// types
import type { Asset } from './models/Asset';
import type { Erc721TransferMethod } from './models/Transaction';
import type { RatesByAssetAddress } from './models/Rates';


type Address = string;

type ERC20TransferOptions = {
  contractAddress: string,
  to: Address,
  amount: number | string,
  wallet: Object,
  decimals: number,
  nonce?: number,
  signOnly?: boolean,
  gasLimit?: number,
  gasPrice?: number,
  data?: string,
};

type ERC721TransferOptions = {
  contractAddress: string,
  from: Address,
  to: Address,
  tokenId: string,
  wallet: Object,
  nonce?: number,
  signOnly?: boolean,
  gasLimit?: number,
  gasPrice?: number,
  useLegacyTransferMethod: boolean,
};

type ETHTransferOptions = {
  gasLimit?: number,
  gasPrice?: number,
  amount: number | string,
  to: Address,
  wallet: Object,
  nonce?: number,
  signOnly?: boolean,
  data?: string,
};

export const encodeContractMethod = (
  contractAbi: string | Object[],
  method: string,
  params: any,
): string => {
  const contractInterface = new ethers.utils.Interface(contractAbi);
  return contractInterface.encodeFunctionData(method, params);
};

function contractHasMethod(contractCode: string, encodedMethodName: string): boolean {
  return contractCode.includes(encodedMethodName);
}

// export async function transferERC20(options: ERC20TransferOptions) {
//   const {
//     contractAddress,
//     amount,
//     wallet: Wallet,
//     decimals: defaultDecimals = 18,
//     nonce,
//     gasLimit,
//     gasPrice,
//     signOnly = false,
//   } = options;
//   let { data, to } = options;

//   const wallet = wallet.connect(getEthereumProvider(getEnv().NETWORK_PROVIDER));
//   const contractAmount = parseTokenBigNumberAmount(amount, defaultDecimals);

//   if (!data) {
//     try {
//       data = encodeContractMethod(ERC20_CONTRACT_ABI, 'transfer', [to, contractAmount]);
//     } catch (e) {
//       //
//     }
//     to = contractAddress;
//   }

//   const transaction = {
//     gasLimit,
//     gasPrice: EthersBigNumber.from(gasPrice),
//     to,
//     nonce,
//     data,
//   };
//   if (!signOnly) return wallet.sendTransaction(transaction);

//   const signedHash = await wallet.signTransaction(transaction);
//   return { signedHash, value: contractAmount };
// }

/* eslint-disable i18next/no-literal-string */
function getERC721ContractTransferMethod(
  code: any,
  isReceiverContractAddress: boolean,
  useLegacyTransferMethod?: boolean,
): string {
  // Legacy NFTs (like cryptokitties) always require use of `transfer` method.
  if (useLegacyTransferMethod) {
    return  ERC721_TRANSFER_METHODS.TRANSFER;
  }

  /**
   * sending to contract with "safeTransferFrom" will fail if contract doesn't have
   * "onERC721Received" event implemented, just to make everything more
   * stable we can just disable safeTransferFrom if receiver
   * address is contract and use other methods
   * this can be improved by checking if contract byte code
   * contains hash of "onERC721Received", but this might not be
   * always true as "contract" might be a proxy and will return that
   * it doesn't have it anyway
   * (ref – https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md)
   */

  // first 4 bytes of the encoded signature for a lookup in the contract code
  // encoding: utils.keccak256(utils.toUtf8Bytes(signature)
  const transferHash = 'a9059cbb'; // transfer(address,uint256)
  const safeTransferFromHash = '42842e0e'; // safeTransferFrom(address,address,uint256)
  const transferFromHash = '23b872dd'; // transferFrom(address,address,uint256)

  if (!isReceiverContractAddress && contractHasMethod(code, safeTransferFromHash)) {
    return ERC721_TRANSFER_METHODS.SAFE_TRANSFER_FROM;
  } else if (contractHasMethod(code, transferFromHash)) {
    return ERC721_TRANSFER_METHODS.TRANSFER_FROM;
  } else if (contractHasMethod(code, transferHash)) {
    return ERC721_TRANSFER_METHODS.TRANSFER;
  }

  /**
   * sometimes code contains proxy contract code on which one of the methods can be found,
   * let's fallback to transferFrom which belongs to EIP 721/1155 standard
   */

  return ERC721_TRANSFER_METHODS.TRANSFER_FROM;
}
/* eslint-enable i18next/no-literal-string */

type Erc721TransactionPayload = {
  from: string,
  to: string,
  contractAddress: string,
  tokenId: string,
  useLegacyTransferMethod: boolean,
}

export const buildERC721TransactionData = async (
  { from, to, tokenId, contractAddress, useLegacyTransferMethod }: Erc721TransactionPayload,
  customProvider?: any,
): Promise<string> => {
  const provider = customProvider || getEthereumProvider(getEnv().NETWORK_PROVIDER);

  const code = await provider.getCode(contractAddress);
  const receiverCode = await provider.getCode(to);
  // regular address will return exactly 0x while contract address will return 0x...0
  const isReceiverContractAddress = receiverCode && receiverCode.length > 2;

  const contractTransferMethod = <ERC721_TRANSFER_METHODS> getERC721ContractTransferMethod(
    code,
    isReceiverContractAddress,
    useLegacyTransferMethod,
  );

  let contractAbi;
  let params;
  switch (contractTransferMethod) {
    case ERC721_TRANSFER_METHODS.SAFE_TRANSFER_FROM:
      contractAbi = ERC721_CONTRACT_ABI_SAFE_TRANSFER_FROM;
      params = [from, to, tokenId];
      break;
    case ERC721_TRANSFER_METHODS.TRANSFER:
      contractAbi = ERC721_CONTRACT_ABI_TRANSFER;
      params = [to, tokenId];
      break;
    case ERC721_TRANSFER_METHODS.TRANSFER_FROM:
      contractAbi = ERC721_CONTRACT_ABI_TRANSFER_FROM;
      params = [from, to, tokenId];
      break;
    default:
      break;
  }

  // $FlowFixMe – asks for contractAbi to be surely initialized
  return encodeContractMethod(contractAbi, contractTransferMethod, params);
};

// export async function transferERC721(options: ERC721TransferOptions) {
//   const {
//     contractAddress,
//     tokenId,
//     wallet: walletInstance,
//     nonce,
//     gasLimit,
//     gasPrice,
//     signOnly = false,
//   } = options;

//   const wallet = walletInstance.connect(getEthereumProvider(getEnv().COLLECTIBLES_NETWORK));
//   const data = await buildERC721TransactionData(options, wallet.provider);

//   if (!data) {
//     reportLog('Could not transfer collectible', {
//       networkProvider: getEnv().COLLECTIBLES_NETWORK,
//       contractAddress,
//       tokenId,
//     });
//     return { error: ERROR_TYPE.CANT_BE_TRANSFERRED, noRetry: true };
//   }

//   const transaction = {
//     to: contractAddress,
//     data,
//     nonce,
//     gasLimit,
//     gasPrice: EthersBigNumber.from(gasPrice),
//   };

//   if (signOnly) return wallet.signTransaction({ ...transaction, data });

//   return wallet.sendTransaction(transaction);
// }

// export async function transferETH(options: ETHTransferOptions) {
//   const {
//     to,
//     wallet: walletInstance,
//     gasPrice,
//     gasLimit,
//     amount,
//     nonce,
//     signOnly = false,
//     data,
//   } = options;
//   const value = utils.parseEther(amount.toString());
//   const trx = {
//     gasLimit,
//     gasPrice: EthersBigNumber.from(gasPrice),
//     value,
//     to,
//     nonce,
//     data,
//   };
//   const wallet = walletInstance.connect(getEthereumProvider(getEnv().NETWORK_PROVIDER));
//   if (!signOnly) return wallet.sendTransaction(trx);
//   const signedHash = await wallet.signTransaction(trx);
//   return { signedHash, value };
// }

export async function sendRawTransaction(
  walletInstance: ethers.Wallet,
  transaction: ethers.Transaction,
) {
  const wallet = walletInstance.connect(getEthereumProvider(getEnv().NETWORK_PROVIDER));
  return wallet.sendTransaction(transaction);
}

export function fetchRinkebyETHBalance(walletAddress: Address): Promise<string> {
  const provider = getEthereumProvider('rinkeby');
  return provider.getBalance(walletAddress).then(utils.formatEther);
}

// export async function getExchangeRates(
//   chain: string,
//   assets: Asset[],
// ): Promise<?RatesByAssetAddress> {
//   if (isEmpty(assets)) {
//     reportLog('getExchangeRates received empty assets', { assets });
//   }

//   // $FlowFixMe
//   let rates = !isEmpty(assets) ? await getCoinGeckoTokenPrices(chain, assets) : {};

//   const nativeAssetAddress = nativeAssetPerChain[chain].address;
//   const listHasNativeAsset = assets.some(({ address }) => addressesEqual(address, nativeAssetAddress));

//   // if empty assets still proceed to fetch native token rate for deployment calculations
//   if (listHasNativeAsset || isEmpty(assets)) {
//     const coinId = chainToCoinGeckoCoinId[chain];
//     const nativeAssetPrice = await getCoinGeckoPricesByCoinId(coinId);
//     if (!isEmpty(nativeAssetPrice)) {
//       // $FlowFixMe
//       rates = { ...rates, [addressAsKey(nativeAssetAddress)]: nativeAssetPrice };
//     }
//   }

//   if (!rates) {
//     reportErrorLog('getExchangeRates failed: no rates data', { rates, assets });
//     return null;
//   }

//   return Object.keys(rates).reduce((mappedData: RatesByAssetAddress, returnedAssetAddress: string) => ({
//     ...mappedData,
//     [addressAsKey(returnedAssetAddress)]: rates[returnedAssetAddress],
//   }), {});
// }

export function transferSigned(signed: string) {
  const provider = getEthereumProvider(getEnv().NETWORK_PROVIDER);
  return provider.sendTransaction(signed);
}

export const DEFAULT_GAS_LIMIT = 500000;

// export async function calculateGasEstimate(transaction: Object) {
//   const {
//     from,
//     amount,
//     symbol,
//     contractAddress,
//     decimals: defaultDecimals = 18,
//     tokenId,
//   } = transaction;
//   let { to, data } = transaction;
//   const provider = getEthereumProvider(tokenId ? getEnv().COLLECTIBLES_NETWORK : getEnv().NETWORK_PROVIDER);
//   const value = symbol === ETH
//     ? utils.parseEther(amount.toString())
//     : '';
//   try {
//     if (tokenId) {
//       data = await buildERC721TransactionData(transaction, provider);
//       if (!data) return DEFAULT_GAS_LIMIT;
//       to = contractAddress;
//     } else if (!data && contractAddress && symbol !== ETH) {
//       /**
//        * we check `symbol !== ETH` because our assets list also includes ETH contract address
//        * so want to check if it's also not ETH send flow
//        */
//       const contractAmount = parseTokenBigNumberAmount(amount, defaultDecimals);
//       data = encodeContractMethod(ERC20_CONTRACT_ABI, 'transfer', [to, contractAmount]);
//       to = contractAddress;
//     }
//   } catch (e) {
//     return DEFAULT_GAS_LIMIT;
//   }
//   // all parameters are required in order to estimate gas limit precisely
//   return provider.estimateGas({
//     from,
//     to,
//     data,
//     value,
//   })
//     .then(calculatedGasLimit =>
//       Math.round(EthersBigNumber.from(calculatedGasLimit).toNumber() * 1.5), // safe buffer multiplier
//     )
//     .catch(() => DEFAULT_GAS_LIMIT);
// }

export const buildERC20ApproveTransactionData = (
  spenderAddress: string,
  amount: string,
  decimals: number,
): string => {
  const contractAmount = parseTokenBigNumberAmount(amount, decimals);
  return encodeContractMethod(ERC20_CONTRACT_ABI, 'approve', [spenderAddress, contractAmount]);
};
