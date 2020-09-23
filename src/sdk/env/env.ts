import { ApiOptions } from '../api';
import { NetworkOptions } from '../network';
import { EnvNames, SUPPORTED_ENVS } from './constants';

export class Env {
  static defaultName: EnvNames = EnvNames.MainNets;

  static prepare(env: EnvNames | Env): Env {
    let partial: Env = null;

    if (env) {
      switch (typeof env) {
        case 'string':
          partial = SUPPORTED_ENVS[env];
          break;

        case 'object':
          if (env.apiOptions && env.networkOptions) {
            partial = env;
          }
          break;
      }

      if (!partial || !partial.apiOptions || !partial.networkOptions) {
        throw new Error(`Unsupported env`);
      }
    } else {
      partial = SUPPORTED_ENVS[this.defaultName || EnvNames.MainNets];
    }

    return new Env(partial);
  }

  apiOptions: ApiOptions;
  networkOptions: NetworkOptions;

  constructor(partial: Partial<Env>) {
    Object.assign(this, partial);
  }
}
