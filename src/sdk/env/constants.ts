import { NetworkNames } from '../network';
import { Env } from './env';

export enum EnvNames {
  MainNets = 'mainnets',
  TestNets = 'testnets',
  LocalNets = 'localnets',
}

export const SUPPORTED_ENVS: { [key: string]: Env } = {
  [EnvNames.MainNets]: {
    apiOptions: {
      host: 'mainnets.etherspot.pillarproject.io',
      useSsl: true,
    },
    networkOptions: {
      supportedNetworkNames: [NetworkNames.Mainnet, NetworkNames.Xdai],
    },
  },
  [EnvNames.TestNets]: {
    apiOptions: {
      host: 'testnets.etherspot.pillarproject.io',
      useSsl: true,
    },
    networkOptions: {
      supportedNetworkNames: [NetworkNames.Goerli, NetworkNames.Ropsten, NetworkNames.Rinkeby, NetworkNames.Kovan],
    },
  },
  [EnvNames.LocalNets]: {
    apiOptions: {
      host: '0.0.0.0',
      port: 4000,
    },
    networkOptions: {
      supportedNetworkNames: [NetworkNames.LocalA, NetworkNames.LocalB],
    },
  },
};
