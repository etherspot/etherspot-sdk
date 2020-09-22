export enum NetworkNames {
  Mainnet = 'mainnet',
  Ropsten = 'ropsten',
  Rinkeby = 'rinkeby',
  Goerli = 'goerli',
  Kovan = 'kovan',
  Xdai = 'xdai',
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
  [NetworkNames.LocalA]: 9999,
  [NetworkNames.LocalB]: 6666,
};
