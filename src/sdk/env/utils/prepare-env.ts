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
        if (env.apiOptions && env.networkOptions) {
          result = env;
        }
        break;
    }

    if (!result || !result.apiOptions || !result.networkOptions) {
      throw new Error(`Unsupported env`);
    }
  } else {
    result = SUPPORTED_ENVS[DEFAULT_ENV_NAME];
  }

  return result;
}
