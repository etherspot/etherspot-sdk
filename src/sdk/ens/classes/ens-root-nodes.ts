import { PaginationResult } from '../../common';
import { Type } from 'class-transformer';
import { ENSRootNode } from './ens-root-node';

export class ENSRootNodes extends PaginationResult<ENSRootNode> {
  @Type(() => ENSRootNode)
  items: ENSRootNode[];
}
