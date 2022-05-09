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
        NetworkNames.Matic,
        NetworkNames.Aurora,
        NetworkNames.Avalanche,
        NetworkNames.Optimism,
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
        NetworkNames.Mumbai,
        NetworkNames.AuroraTest,
        NetworkNames.Fuji,
        NetworkNames.OptimismKovan,
        NetworkNames.Etherspot,
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
        NetworkNames.LocalH,
      ],
    },
  },
};
