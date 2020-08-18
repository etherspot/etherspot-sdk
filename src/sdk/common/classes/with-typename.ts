import { Exclude } from 'class-transformer';

/**
 * @ignore
 */
export abstract class WithTypename {
  @Exclude()
  __typename?: any;
}
