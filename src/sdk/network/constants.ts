export enum NetworkNames {
  Mainnet = 'Mainnet',
  Goerli = 'Goerli',
  Local = 'Local',
}

export const NETWORK_NAME_TO_CHAIN_ID: {
  [key: string]: number;
} = {
  [NetworkNames.Mainnet]: 1,
  [NetworkNames.Goerli]: 5,
  [NetworkNames.Local]: 9999,
};
