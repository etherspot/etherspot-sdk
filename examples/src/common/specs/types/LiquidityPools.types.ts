import type { BigNumber } from 'ethers';

export   namespace LIQUIDITY_POOL_TYPES {
  export const UNISWAP = 'UNISWAP';
  export const UNIPOOL = 'UNIPOOL';
}

export type LIQUIDITY_POOL_TYPES = typeof LIQUIDITY_POOL_TYPES[keyof typeof LIQUIDITY_POOL_TYPES];

export type LiquidityPoolBase = {
  name: string,
  symbol: string,
  tokensProportions: {
    symbol: string,
    address: string,
    proportion: number,
    progressBarColor?: string,
  }[],
  iconUrl: string,
  rewardsEnabled?: boolean,
  rewards?: {
    symbol: string,
    amount: number,
  }[],
};

export type UniswapLiquidityPool = LiquidityPoolBase & {
  type: typeof LIQUIDITY_POOL_TYPES.UNISWAP,
  uniswapPairAddress: string,
};

export type UnipoolLiquidityPool = LiquidityPoolBase & {
  type: typeof LIQUIDITY_POOL_TYPES.UNIPOOL,
  uniswapPairAddress: string,
  unipoolAddress: string,
  unipoolSubgraphName: string,
};

export type LiquidityPool = UniswapLiquidityPool | UnipoolLiquidityPool;


type Astring = [string];

export type LiquidityPoolStats = {
  currentPrice: number,
  dayPriceChange: number,
  weekPriceChange: number,
  monthPriceChange: number,
  volume: number,
  totalLiquidity: number,
  dailyVolume: number,
  dailyFees: number,
  tokensLiquidity: {stringIndex: number },
  stakedAmount: BigNumber,
  rewardsToClaim: number,
  tokensPrices: {Astring: number },
  tokensPricesUSD: {Astring: number },
  tokensPerLiquidityToken: {Astring: number },
  totalSupply: number,
  history: {date: Date, value: number}[],
  userLiquidityTokenBalance: BigNumber,
};
