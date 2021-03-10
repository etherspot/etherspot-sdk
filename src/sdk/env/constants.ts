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
      host: 'etherspot.pillarproject.io',
      useSsl: true,
    },
    networkOptions: {
      supportedNetworkNames: [
        NetworkNames.Mainnet, //
        NetworkNames.Xdai,
        NetworkNames.Bsc,
        NetworkNames.Fantom,
      ],
    },
  },
  [EnvNames.TestNets]: {
    apiOptions: {
      host: 'qa-etherspot.pillarproject.io',
      useSsl: true,
    },
    networkOptions: {
      supportedNetworkNames: [
        NetworkNames.Ropsten,
        NetworkNames.Rinkeby,
        NetworkNames.Goerli,
        NetworkNames.Kovan,
        NetworkNames.Sokol,
        NetworkNames.BscTest,
        NetworkNames.FantomTest,
      ],
    },
  },
  [EnvNames.LocalNets]: {
    apiOptions: {
      host: 'localhost',
      port: 4000,
    },
    networkOptions: {
      supportedNetworkNames: [
        NetworkNames.LocalA, //
        NetworkNames.LocalB,
      ],
    },
  },
};
