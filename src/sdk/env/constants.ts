import { NetworkNames } from '../network';
import { Env } from './env';

export enum EnvNames {
  MainNets = 'mainnets',
  TestNets = 'testnets',
  LocalNets = 'localnets',
  MainNetsTest = 'mainnetstest'
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
        NetworkNames.Arbitrum,
        NetworkNames.Moonbeam,
        NetworkNames.Celo,
        NetworkNames.Fuse,
        NetworkNames.ArbitrumNova,
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
        NetworkNames.Goerli,
        NetworkNames.Sokol,
        NetworkNames.BscTest,
        NetworkNames.FantomTest,
        NetworkNames.Mumbai,
        NetworkNames.AuroraTest,
        NetworkNames.Fuji,
        NetworkNames.ArbitrumTest,
        NetworkNames.Moonbase,
        NetworkNames.CeloTest,
        NetworkNames.FuseSparknet,
        NetworkNames.ArbitrumNitro,
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
        NetworkNames.Goerli,
        NetworkNames.Mumbai,
      ],
    },
  },
  [EnvNames.MainNetsTest]: {
    apiOptions: {
      host: 'qa-etherspot.pillarproject.io',
      useSsl: true,
    },
    networkOptions: {
      supportedNetworkNames: [
        NetworkNames.Matic
      ],
    },
  }
};
