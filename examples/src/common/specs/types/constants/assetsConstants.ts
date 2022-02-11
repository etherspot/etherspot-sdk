import { ethers } from 'ethers';


// // fiat
// export const USD = ('USD': 'USD');
// export const EUR = ('EUR': 'EUR');
// export const GBP = ('GBP': 'GBP');

// token symbols
export namespace ETH {
  export const ETH = 'ETH';
};


export const PLR = 'PLR';

export const MATIC = 'MATIC';
export const BNB = 'BNB';
export const XDAI = 'xDAI';
export const AVAX = 'AVAX';

export const SNX = 'SNX';
export const RSPT = 'RSPT';
export const WETH = 'WETH';
const LINK = 'LINK';
const BAT = 'BAT';
const AE = 'AE';
const MKR = 'MKR';
export const USDT = 'USDT';
export const USDC = 'USDC';
const PPT = 'PPT';
export const DAI = 'DAI';
const KNC = 'KNC';
const VERI = 'VERI';
const BNT = 'BNT';
const OMG = 'OMG';
const WAX = 'WAX';
const ZIL = 'ZIL';
const ZRX = 'ZRX';
export const TUSD = 'TUSD';
export const mUSD = 'mUSD';
const YFI = 'YFI';

// BTC tokens
export const BTC = 'BTC';
export const WBTC = 'WBTC';
const sBTC = 'sBTC';
const iBTC = 'iBTC';
const renBTC = 'renBTC';
const tBTC = 'tBTC';
const OBTC = 'OBTC';
const wBTC = 'wBTC'; // testnet
const testBTC = 'testBTC'; // testnet

export const SYNTHETIC = 'SYNTHETIC';
export const NONSYNTHETIC = 'NONSYNTHETIC';
export const ETHEREUM_ADDRESS_PREFIX = 'ethereum';

// export const defaultFiatCurrency = GBP;
// export const supportedFiatCurrencies = [GBP, USD, EUR];

// export const rateKeys = [USD, EUR, GBP, ETH];

export const DEFAULT_ACCOUNTS_ASSETS_DATA_KEY = 'default';
export const VISIBLE_NUMBER_DECIMALS = 18;

export const POPULAR_EXCHANGE_TOKENS = [
  ETH,
  PLR,
  LINK,
  BAT,
  PPT,
  AE,
  DAI,
  KNC,
  MKR,
  USDT,
  VERI,
  BNT,
  OMG,
  WAX,
  ZIL,
  ZRX,
];

export const HIGH_VALUE_TOKENS = [YFI, WBTC, sBTC, BTC, iBTC, renBTC, tBTC, OBTC, wBTC, testBTC];

export const SPEED_TYPES = {
  SLOW: 'min',
  NORMAL: 'avg',
  FAST: 'max',
};

export const SPEED_TYPE_LABELS = {
  [SPEED_TYPES.SLOW]: 'Slow',
  [SPEED_TYPES.NORMAL]: 'Normal',
  [SPEED_TYPES.FAST]: 'Fast',
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  GBP: '£',
  EUR: '€',
};

export namespace ASSET_CATEGORY  {
  export const WALLET = 'wallet';
  export const DEPOSITS = 'deposits';
  export const INVESTMENTS = 'investments';
  export const LIQUIDITY_POOLS = 'liquidityPools';
  export const COLLECTIBLES = 'collectibles';
  export const REWARDS = 'rewards';
};

export const ADDRESS_ZERO = ethers.constants.AddressZero;

export const PLR_ADDRESS_BSC = '0x790cfdc6ab2e0ee45a433aac5434f183be1f6a20';
export const PLR_ADDRESS_POLYGON = '0xa6b37fc85d870711c56fbcb8afe2f8db049ae774';
export const PLR_ADDRESS_XDAI = ''; // TODO: to be added when available
export const PLR_ADDRESS_ETHEREUM_MAINNET = '0xe3818504c1b32bf1557b16c238b2e01fd3149c17';
export const PLR_ADDRESS_ETHEREUM_KOVAN_TESTNET = '0xdd3122831728404a7234e5981677a5fd0a9727fe';
export const PLR_ADDRESS_AVALANCHE = ''; // TODO: to be added when available
