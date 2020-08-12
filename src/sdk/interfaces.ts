import { ApiOptions } from './api';
import { NetworkNames } from './network';

export interface SdkOptions {
  networkName?: NetworkNames;
  apiOptions?: ApiOptions;
}
