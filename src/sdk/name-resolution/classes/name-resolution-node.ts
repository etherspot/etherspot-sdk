import { Type } from 'class-transformer';
import { NameResolutionNodeStates, NameResolutionNodeZones } from '../constants';
import { NameResolutionRootNode } from './name-resolution-root-node';

export class NameResolutionNode {
  @Type(() => NameResolutionRootNode)
  rootNode: Partial<NameResolutionRootNode>;

  hash: string;

  name: string;

  label: string;

  address: string;

  state: NameResolutionNodeStates;

  zone?: NameResolutionNodeZones;

  guardianSignature: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;

  fioChainCode: string;

  fioTokenCode: string;
}
