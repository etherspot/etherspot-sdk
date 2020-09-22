import { ApiOptions } from '../api';
import { NetworkNames } from '../network';

export interface Env {
  apiOptions: ApiOptions;
  defaultNetworkName: NetworkNames;
  supportedNetworkNames: NetworkNames[];
}
