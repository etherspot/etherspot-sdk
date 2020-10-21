import { EnvLike } from './env';
import { StateOptions } from './state';

export interface SdkOptions {
  env?: EnvLike;
  state?: StateOptions;
}
