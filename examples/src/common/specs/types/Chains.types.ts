import { ETH, MATIC, BNB, AVAX, XDAI, ADDRESS_ZERO } from './constants/assetsConstants';
import { CHAIN } from './constants/chainConstants';

/* eslint-disable i18next/no-literal-string */
export const nativeAssetPerChain = {
  ethereum: {
    chain: CHAIN.ETHEREUM,
    address: ADDRESS_ZERO,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    iconUrl: 'https://tokens.1inch.exchange/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
  },
  polygon: {
    chain: CHAIN.POLYGON,
    address: ADDRESS_ZERO,
    name: 'Matic',
    symbol: MATIC,
    decimals: 18,
    iconUrl: 'https://tokens.1inch.exchange/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png',
  },
  binance: {
    chain: CHAIN.BINANCE,
    address: ADDRESS_ZERO,
    name: 'BNB',
    symbol: BNB,
    decimals: 18,
    iconUrl: 'https://tokens.1inch.exchange/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
  },
  xdai: {
    chain: CHAIN.XDAI,
    address: ADDRESS_ZERO,
    name: 'xDAI',
    symbol: XDAI,
    decimals: 18,
    iconUrl: 'https://tokens.1inch.exchange/0x6b175474e89094c44da98b954eedeac495271d0f.png',
  },
  avalanche: {
    chain: CHAIN.AVALANCHE,
    address: ADDRESS_ZERO,
    name: 'Avalanche',
    symbol: AVAX,
    decimals: 18,
    iconUrl: 'https://image.pngaaa.com/19/5554019-middle.png',
  },
};
