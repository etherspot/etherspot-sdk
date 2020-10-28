import { Type } from 'class-transformer';
import { PaginationResult } from '../../common';
import { Project } from './project';

export class Projects extends PaginationResult<Project> {
  @Type(() => Project)
  items: Project[];
}
