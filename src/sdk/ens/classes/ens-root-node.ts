import { Type } from 'class-transformer';
import { ENSRootNodeStates } from '../constants';

export class ENSRootNode {
  hash: string;

  name: string;

  state: ENSRootNodeStates;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
