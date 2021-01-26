import { mockService } from '../../../testing';
import { ObjectSubject } from '../../common';
import { CurrentProject } from '../interfaces';

const currentProject$ = new ObjectSubject<CurrentProject>(null);

const mocked = {
  currentProject$,
  switchCurrentProject: jest.fn(),
  withCustomProjectMetadata: jest.fn(),
  getProject: jest.fn(),
  getProjects: jest.fn(),
  updateProject: jest.fn(),
  callCurrentProject: jest.fn(),
};

Object.defineProperty(mocked, 'headers', {
  get: jest.fn(() => ({})),
});

Object.defineProperty(mocked, 'currentProject', {
  get: jest.fn(() => currentProject$.value),
});

export const ProjectService = mockService(mocked);
