import { Exclude } from 'class-transformer';

/**
 * @ignore
 */
export abstract class WithTypename {
  /**
   * @ignore
   */
  @Exclude()
  __typename?: any;
}
