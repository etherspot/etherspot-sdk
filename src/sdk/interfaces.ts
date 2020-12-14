import { EnvLike } from './env';
import { StateStorage } from './state';
import { NetworkNames } from './network';

export interface SdkOptions {
  env?: EnvLike;
  networkName?: NetworkNames;
  projectKey?: string;
  projectMetadata?: string;
  stateStorage?: StateStorage;
  omitWalletProviderNetworkCheck?: boolean;
}
