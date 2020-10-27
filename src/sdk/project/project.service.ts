import { Service, ObjectSubject, HeaderNames } from '../common';
import { Project } from './interfaces';

export class ProjectService extends Service {
  readonly project$ = new ObjectSubject<Project>(null);

  constructor(project: Project = null) {
    super();

    if (project) {
      const { key, metadata } = project;
      if (key) {
        this.project$.next({
          key,
          metadata: metadata || null,
        });
      }
    }
  }

  get headers(): { [key: string]: any } {
    let result: { [key: string]: any } = {};

    if (this.project) {
      const { key, metadata } = this.project;

      if (key) {
        result = {
          [HeaderNames.ProjectKey]: key,
        };

        if (metadata) {
          result = {
            ...result,
            [HeaderNames.ProjectMetadata]: metadata,
          };
        }
      }
    }

    return result;
  }

  get project(): Project {
    return this.project$.value;
  }

  switchProject(project: Project): Project {
    this.project$.next(project || null);
    return this.project;
  }
}
