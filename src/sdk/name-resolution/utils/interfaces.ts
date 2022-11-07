import { NameResolutionNodeZones } from '../constants';

export interface ParsedResolutionName {
  name: string;
  hash: string;
  label: string;
  labelHash: string;
  root: {
    name: string;
    hash: string;
  };
//  zone: NameResolutionNodeZones;
}