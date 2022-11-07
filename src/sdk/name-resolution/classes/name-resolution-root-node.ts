import { Type } from 'class-transformer';
import { NameResolutionRootNodeStates } from '../constants';

export class NameResolutionRootNode {
  hash: string;

  name: string;

  state: NameResolutionRootNodeStates;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
