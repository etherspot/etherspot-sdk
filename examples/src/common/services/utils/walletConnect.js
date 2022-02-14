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
import { BigNumber as EthersBigNumber, Interface, utils } from 'ethers';
import { orderBy } from 'lodash';
import t from 'translations/translate';

// Constants
import { TOKEN_TRANSFER } from 'constants/functionSignaturesConstants';
import {
  ETH_SEND_TX,
  ETH_SIGN,
  ETH_SIGN_TX,
  ETH_SIGN_TYPED_DATA,
  ETH_SIGN_TYPED_DATA_V4,
  PERSONAL_SIGN,
  REQUEST_TYPE,
} from 'constants/walletConnectConstants';

// utils
import { addressesEqual, findAssetByAddress } from 'utils/assets';
import { reportErrorLog } from 'utils/common';
import { stripEmoji } from 'utils/strings';
import { chainFromChainId, nativeAssetPerChain } from 'utils/chains';

// abi
import ERC20_CONTRACT_ABI from 'abi/erc20.json';

// Types
import type {
  WalletConnectCallRequest,
  WalletConnectCallRequestType,
  WalletConnectSession,
} from 'models/WalletConnect';
import type { TransactionPayload } from 'models/Transaction';
import type { AssetByAddress, AssetsPerChain } from 'models/Asset';
import type { ChainRecord } from 'models/Chain';


// urls of dapps that don't support smart accounts
// or that we don't want to support for any reason
// TODO: still unsupported?
const UNSUPPORTED_APPS_URLS: string[] = [
  'https://app.mooni.tech',
  'https://localcryptos.com',
  'https://www.binance.org',
];

export const hasKeyBasedWalletConnectSession = (
  sessions: WalletConnectSession[],
  keyWalletAddress: string,
): boolean => {
  if (!sessions[0]?.accounts) return false;
  return sessions[0].accounts.some((address) => addressesEqual(address, keyWalletAddress));
};

export const isSupportedDappUrl = (url: string): boolean => !UNSUPPORTED_APPS_URLS.includes(url);

const isTokenTransfer = (data) => typeof data === 'string'
  && data.toLowerCase() !== '0x'
  && data.toLowerCase().startsWith(TOKEN_TRANSFER);

export const parseMessageSignParamsFromCallRequest = (callRequest: WalletConnectCallRequest): {
  address: string,
  message: string,
  displayMessage: string,
} => {
  const { method, params } = callRequest;

  let callRequestParams = [...params];
  if (method === PERSONAL_SIGN) {
    // different param order on PERSONAL_SIGN
    callRequestParams = callRequestParams.reverse();
  }

  const [address, message] = callRequestParams;

  let displayMessage;
  if (method === PERSONAL_SIGN) {
    try {
      displayMessage = utils.toUtf8String(message);
    } catch (e) {
      reportErrorLog('parseMessageSignParamsFromCallRequest PERSONAL_SIGN failed', {
        message,
        callRequest,
      });
      ([, displayMessage] = callRequestParams);
    }
  } else if (method === ETH_SIGN_TYPED_DATA) {
    displayMessage = t('transactions.paragraph.typedDataMessage');
  } else {
    ([, displayMessage] = callRequestParams);
  }

  return { address, message, displayMessage };
};

export const mapCallRequestToTransactionPayload = (
  callRequest: WalletConnectCallRequest,
  accountAssetsPerChain: ChainRecord<AssetByAddress>,
  supportedAssetsPerChain: AssetsPerChain,
): $Shape<TransactionPayload> => {
  const [{ value = 0, data }] = callRequest.params;
  let [{ to }] = callRequest.params;

  const { chainId } = callRequest;
  const chain = chainFromChainId[chainId];

  const chainSupportedAssets = supportedAssetsPerChain[chain] ?? [];

  // to address can be either token contract (transfer data) or other kind of contract
  const assetData = isTokenTransfer(data) && to
    ? findAssetByAddress(chainSupportedAssets, to)
    : null;

  let amount;
  if (!assetData) {
    amount = utils.formatEther(EthersBigNumber.from(value).toString());
  } else {
    const erc20Interface = new Interface(ERC20_CONTRACT_ABI);
    const parsedTransaction = erc20Interface.parseTransaction({ data, value }) || {};
    const {
      args: [
        methodToAddress,
        methodValue = 0,
      ],
    } = parsedTransaction; // get method value and address input

    // do not parse amount as number, last decimal numbers might change after converting
    amount = utils.formatUnits(methodValue, assetData.decimals);
    to = methodToAddress;
  }

  const nativeAssetData = nativeAssetPerChain[chain];

  const {
    symbol = nativeAssetData.symbol,
    address: contractAddress = nativeAssetData.address,
    decimals = nativeAssetData.decimals,
  } = assetData ?? {};

  return {
    to,
    amount,
    data,
    symbol,
    contractAddress,
    decimals,
    chain,
  };
};

export const getWalletConnectCallRequestType = (
  callRequest: WalletConnectCallRequest,
): WalletConnectCallRequestType => {
  switch (callRequest?.method) {
    case ETH_SEND_TX:
    case ETH_SIGN_TX:
      return REQUEST_TYPE.TRANSACTION;
    case ETH_SIGN:
    case ETH_SIGN_TYPED_DATA:
    case ETH_SIGN_TYPED_DATA_V4:
    case PERSONAL_SIGN:
      return REQUEST_TYPE.MESSAGE;
    default:
      return REQUEST_TYPE.UNSUPPORTED;
  }
};

export function formatRequestType(type: WalletConnectCallRequestType) {
  switch (type) {
    case REQUEST_TYPE.MESSAGE:
      return t('walletConnect.requests.messageRequest');
    case REQUEST_TYPE.TRANSACTION:
      return t('walletConnect.requests.transactionRequest');
    default:
      return t('walletConnect.requests.unsupportedRequest');
  }
}

/**
 * Heuristic way of parsing app name.
 *
 */
export const parsePeerName = (name: ?string): string => {
  if (!name) return '';

  let result = name;

  // Remove text after hyphen
  // eslint-disable-next-line prefer-destructuring
  result = result.split('-')[0];

  // eslint-disable-next-line prefer-destructuring
  result = result.split(':')[0];

  // Strip all emojis
  result = stripEmoji(result);

  // Fallback if there is nothing left
  if (result.length === 0) {
    result = name;
  }

  result = result.trim();

  // Limit length
  if (result.length > 22) {
    // eslint-disable-next-line i18next/no-literal-string
    result = `${result.substring(0, 22)}…`;
  }

  return result.trim();
};

/**
 * Heuristic way of picking the best icon.
 *
 * We try to pick PNG icons with highest pixel value by sorting them first by URL length (desc), then by name (desc).
 * Otherwise just pick whatever is there. See test file for sample cases.
 */
export function pickPeerIcon(icons: ?string[]): ?string {
  if (!icons?.length) return null;
  if (icons?.length === 1) return icons[0];

  const pngUrls = icons.filter((url) => url.endsWith('.png'));
  // Experimentally the first icon is usually the lowest quality, so here we're picking the 2nd one.
  if (!pngUrls.length) return icons[1];

  const sortedPngUrls = orderBy(pngUrls, [(url) => url.length, (url) => url], ['desc', 'desc']);
  return sortedPngUrls[0];
}
