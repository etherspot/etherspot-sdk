import { PaginationResult } from '../../common';
import { Type } from 'class-transformer';
import { ENSNode } from './ens-node';

export class ENSNodes extends PaginationResult<ENSNode> {
  @Type(() => ENSNode)
  items: ENSNode[];
}
