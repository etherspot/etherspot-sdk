import { NetworkNames } from '../network';
import { Env } from './interfaces';

export enum EnvNames {
  MainNets = 'mainnets',
  TestNets = 'testnets',
  LocalNets = 'localnets',
}

export const DEFAULT_ENV_NAME = EnvNames.LocalNets;

export const SUPPORTED_ENVS: { [key: string]: Env } = {
  [EnvNames.MainNets]: {
    apiOptions: null,
    defaultNetworkName: NetworkNames.Mainnet,
    supportedNetworkNames: [NetworkNames.Mainnet, NetworkNames.Xdai],
  },
  [EnvNames.TestNets]: {
    apiOptions: null,
    defaultNetworkName: NetworkNames.Goerli,
    supportedNetworkNames: [NetworkNames.Ropsten, NetworkNames.Rinkeby, NetworkNames.Goerli, NetworkNames.Kovan],
  },
  [EnvNames.LocalNets]: {
    apiOptions: {
      host: '0.0.0.0',
      port: 4000,
    },
    defaultNetworkName: NetworkNames.LocalA,
    supportedNetworkNames: [NetworkNames.LocalA, NetworkNames.LocalB],
  },
};
