export enum NetworkNames {
  Mainnet = 'mainnet',
  Ropsten = 'ropsten',
  Rinkeby = 'rinkeby',
  Goerli = 'goerli',
  Kovan = 'kovan',
  Xdai = 'xdai',
  Sokol = 'sokol',
  Bsc = 'bsc',
  BscTest = 'bscTest',
  Fantom = 'fantom',
  FantomTest = 'fantomTest',
  LocalA = 'localA',
  LocalB = 'localB',
}

export const NETWORK_NAME_TO_CHAIN_ID: {
  [key: string]: number;
} = {
  [NetworkNames.Mainnet]: 1,
  [NetworkNames.Ropsten]: 3,
  [NetworkNames.Rinkeby]: 4,
  [NetworkNames.Goerli]: 5,
  [NetworkNames.Kovan]: 42,
  [NetworkNames.Xdai]: 100,
  [NetworkNames.Sokol]: 77,
  [NetworkNames.Bsc]: 56,
  [NetworkNames.BscTest]: 97,
  [NetworkNames.Fantom]: 250,
  [NetworkNames.FantomTest]: 4002,
  [NetworkNames.LocalA]: 9999,
  [NetworkNames.LocalB]: 6666,
};

export const CHAIN_ID_TO_NETWORK_NAME: { [key: number]: NetworkNames } = Object.entries(
  NETWORK_NAME_TO_CHAIN_ID,
).reduce(
  (result, [networkName, chainId]) => ({
    ...result,
    [chainId]: networkName,
  }),
  {},
);
