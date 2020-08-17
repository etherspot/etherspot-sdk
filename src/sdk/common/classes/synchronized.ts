import { Exclude } from 'class-transformer';

/**
 * @ignore
 */
export class Synchronized {
  synchronizedAt?: Date;

  @Exclude()
  __typename: any;
}
