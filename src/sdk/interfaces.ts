import { NetworkNames } from './network';
import { EnvNames, Env } from './env';

export interface SdkOptions {
  env?: Env | EnvNames;
  network?: NetworkNames;
}
