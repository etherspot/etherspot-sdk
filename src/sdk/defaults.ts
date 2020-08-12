import { ApiOptions } from './api';
import { NetworkNames } from './network';

export const DEFAULT_NETWORK_NAME = NetworkNames.Local;
export const DEFAULT_NETWORK_API_OPTIONS: { [key: string]: ApiOptions } = {
  [NetworkNames.Mainnet]: {
    host: '0.0.0.0',
    port: 3020,
  },
  [NetworkNames.Goerli]: {
    host: '0.0.0.0',
    port: 3020,
  },
  [NetworkNames.Local]: {
    host: '0.0.0.0',
    port: 3020,
  },
};
