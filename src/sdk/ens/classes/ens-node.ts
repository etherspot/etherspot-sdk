import { Type } from 'class-transformer';
import { Synchronized } from '../../common';
import { ENSNodeTypes, ENSNodeStates } from '../constants';

export class ENSNode extends Synchronized {
  hash: string;

  name?: string;

  address: string;

  label?: string;

  type?: ENSNodeTypes;

  state?: ENSNodeStates;

  guardianSignature?: string;

  @Type(() => Date)
  createdAt?: Date;

  @Type(() => Date)
  updatedAt?: Date;
}
