import { EnvLike } from './env';
import { StateOptions } from './state';
import { Project } from './project';

export interface SdkOptions {
  env?: EnvLike;
  state?: StateOptions;
  project?: Project;
}
