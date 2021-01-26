import { clearAllObjectMocks, getMockedInstances } from '../testing';
import { ApiService } from './api';
import { NotificationService } from './notification';
import { Sdk } from './sdk';

jest.mock('./api/api.service');
jest.mock('./notification/notification.service');

describe('Sdk', () => {
  let sdk: Sdk;
  let apiService: jest.Mocked<ApiService>;
  let notificationService: jest.Mocked<NotificationService>;

  beforeAll(() => {
    sdk = new Sdk();
    ({ apiService, notificationService } = getMockedInstances(sdk.services));
  });

  afterEach(() => {
    clearAllObjectMocks(
      apiService, //
      notificationService,
    );
  });

  describe('api', () => {
    it('expect to return apiService instance', () => {
      expect(sdk.api).toBe(apiService);
    });
  });

  describe('notifications$', () => {
    it('expect to return notifications subject', () => {
      expect(sdk.notifications$).toBe(notificationService.notification$);
      expect(notificationService.subscribeNotifications).toBeCalledTimes(1);
    });
  });
});
