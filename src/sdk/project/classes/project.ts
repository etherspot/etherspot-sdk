import { Type } from 'class-transformer';
import { Synchronized } from '../../common/classes';
import { ProjectStates } from '../constants';

export class Project extends Synchronized {
  key: string;

  address: string;

  owner: string;

  state: ProjectStates;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
