import { mockService } from '../../../testing';
import { ObjectSubject } from '../../common';
import { Session } from '../classes';

const session$ = new ObjectSubject<Session>();

const mocked = {
  session$,
  verifySession: jest.fn(),
  createSession: jest.fn(),
};

Object.defineProperty(mocked, 'session', {
  get: jest.fn(() => session$.value),
});

Object.defineProperty(mocked, 'headers', {
  get: jest.fn(() => ({})),
});

export const AuthService = mockService(mocked);
