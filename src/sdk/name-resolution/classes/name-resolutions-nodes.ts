import { BaseClass } from '../../common';
import { Type } from 'class-transformer';
import { NameResolutionSupportedZones } from './name-resolutions-supported-zones';

export class NameResolutionsNodes extends BaseClass<NameResolutionsNodes> {
  @Type(() => NameResolutionSupportedZones)
  results: NameResolutionSupportedZones;

  failed: boolean;

  message?: string;
}
