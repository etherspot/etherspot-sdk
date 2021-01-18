import { Type } from 'class-transformer';
import { ENSNodeStates } from '../constants';
import { ENSRootNode } from './ens-root-node';

export class ENSNode {
  @Type(() => ENSRootNode)
  rootNode: Partial<ENSRootNode>;

  hash: string;

  name: string;

  label: string;

  address: string;

  state: ENSNodeStates;

  guardianSignature: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
