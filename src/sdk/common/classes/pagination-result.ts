/**
 * @ignore
 */
export abstract class PaginationResult<T = any> {
  items?: T[];

  currentPage: number;

  nextPage: number;
}
