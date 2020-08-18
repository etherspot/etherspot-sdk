import { WithTypename } from './with-typename';

/**
 * @ignore
 */
export abstract class PaginationResult<T = any> extends WithTypename {
  items?: T[];

  currentPage: number;

  nextPage: number;
}
