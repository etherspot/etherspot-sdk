import { BaseClass } from '../../common';
import { Type } from 'class-transformer';
import { NameResolutionNode } from './name-resolution-node';

export class NameResolutionSupportedZones extends BaseClass<NameResolutionSupportedZones> {
  @Type(() => NameResolutionNode)
  unstoppabledomains: NameResolutionNode[];

  @Type(() => NameResolutionNode)
  ens: NameResolutionNode[];

  @Type(() => NameResolutionNode)
  fio: NameResolutionNode[];
}
