import { gql } from '@apollo/client/core';
import { Service, ObjectSubject, HeaderNames } from '../common';
import { Project, Projects } from './classes';
import { CurrentProject } from './interfaces';

export class ProjectService extends Service {
  readonly currentProject$ = new ObjectSubject<CurrentProject>(null);

  constructor(currentProject: CurrentProject = null) {
    super();

    this.switchCurrentProject(currentProject);
  }

  get headers(): { [key: string]: any } {
    let result: { [key: string]: any } = {};

    if (this.currentProject) {
      const { key, metadata } = this.currentProject;

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

    return result;
  }

  get currentProject(): CurrentProject {
    return this.currentProject$.value;
  }

  switchCurrentProject(currentProject: CurrentProject): CurrentProject {
    if (currentProject && !currentProject.key) {
      currentProject = null;
    }

    this.currentProject$.next(currentProject);

    return this.currentProject;
  }

  async getProject(key: string): Promise<Project> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: Project;
    }>(
      gql`
        query($chainId: Int, $key: String!) {
          result: project(chainId: $chainId, key: $key) {
            address
            createdAt
            key
            owner
            state
            updatedAt
          }
        }
      `,
      {
        variables: {
          key,
        },
        models: {
          result: Project,
        },
      },
    );

    return result;
  }

  async getProjects(page: number): Promise<Projects> {
    const { apiService, accountService } = this.services;

    const owner = accountService.accountAddress;

    const { result } = await apiService.query<{
      result: Projects;
    }>(
      gql`
        query($chainId: Int, $owner: String!, $page: Int) {
          result: projects(chainId: $chainId, owner: $owner, page: $page) {
            items {
              address
              createdAt
              key
              owner
              state
              updatedAt
            }
            currentPage
            nextPage
          }
        }
      `,
      {
        variables: {
          owner,
          page: page || 1,
        },
        models: {
          result: Projects,
        },
      },
    );

    return result;
  }

  async updateProject(key: string, privateKey: string, endpoint: string): Promise<Project> {
    const { apiService, accountService } = this.services;

    const owner = accountService.accountAddress;

    const { result } = await apiService.mutate<{
      result: Project;
    }>(
      gql`
        mutation($chainId: Int, $key: String!, $owner: String!, $endpoint: String!, $privateKey: String!) {
          result: updateProject(
            chainId: $chainId
            key: $key
            owner: $owner
            endpoint: $endpoint
            privateKey: $privateKey
          ) {
            address
            createdAt
            key
            owner
            state
            updatedAt
          }
        }
      `,
      {
        variables: {
          key,
          owner,
          endpoint,
          privateKey,
        },
        models: {
          result: Project,
        },
      },
    );

    return result;
  }

  async callCurrentProject<T = any, P = any>(payload: P): Promise<T> {
    const { apiService, accountService } = this.services;

    const sender = accountService.accountAddress;

    const { result } = await apiService.mutate<{
      result: {
        data: any;
      };
    }>(
      gql`
        mutation($chainId: Int, $sender: String!, $payload: JSONObject) {
          result: callProject(chainId: $chainId, sender: $sender, payload: $payload) {
            data
          }
        }
      `,
      {
        variables: {
          sender,
          payload,
        },
      },
    );

    return result.data;
  }
}
