import { EnvLike } from './env';
import { StateOptions } from './state';
import { CurrentProject } from './project';

export interface SdkOptions {
  env?: EnvLike;
  state?: StateOptions;
  project?: CurrentProject;
}
