import { EnvNames, DEFAULT_ENV_NAME, SUPPORTED_ENVS } from '../constants';
import { Env } from '../interfaces';

export function prepareEnv(env: EnvNames | Env): Env {
  let result: Env = null;

  if (env) {
    switch (typeof env) {
      case 'string':
        result = SUPPORTED_ENVS[env];
        break;

      case 'object':
        if (
          env.apiOptions &&
          env.defaultNetworkName &&
          Array.isArray(env.supportedNetworkNames) &&
          env.supportedNetworkNames.length
        ) {
          result = env;
        }
        break;
    }
  }

  if (!result) {
    result = SUPPORTED_ENVS[DEFAULT_ENV_NAME];
  }

  return result;
}
