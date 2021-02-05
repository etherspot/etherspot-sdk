import { EnvLike } from './env';
import { StateStorage } from './state';
import { SessionStorage } from './session';
import { NetworkNames } from './network';

export interface SdkOptions {
  env?: EnvLike;
  networkName?: NetworkNames;
  projectKey?: string;
  projectMetadata?: string;
  stateStorage?: StateStorage;
  sessionStorage?: SessionStorage;
  omitWalletProviderNetworkCheck?: boolean;
}
