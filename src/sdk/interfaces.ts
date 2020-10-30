import { EnvLike } from './env';
import { StateStorage } from './state';

export interface SdkOptions {
  env?: EnvLike;
  stateStorage?: StateStorage;
  projectKey?: string;
  projectMetadata?: string;
}
