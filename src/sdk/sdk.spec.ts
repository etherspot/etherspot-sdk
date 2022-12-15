import { clearAllObjectMocks, getMockedInstances } from '../testing';
import { randomPrivateKey } from './common';
import { ApiService } from './api';
import { NotificationService } from './notification';
import { Sdk } from './sdk';
import { RateData } from './rates';

jest.mock('./rates');
jest.mock('./api/api.service');
jest.mock('./notification/notification.service');

describe('Sdk', () => {
  let sdk: Sdk;
  let apiService: jest.Mocked<ApiService>;
  let notificationService: jest.Mocked<NotificationService>;
  let mockedSDK;

  beforeAll(() => {
    sdk = new Sdk(randomPrivateKey());
    ({ apiService, notificationService } = getMockedInstances(sdk.services));
    mockedSDK = getMockedInstances(sdk);

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

  describe('rates', () => {
    it('expect to return success data', async () => {
      const ETH_AAVE_ADDR = '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9';
      const ETH_MATIC_ADDR = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
      const ETH_USDC_ADDR = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
      const ETH_CHAIN_ID = 1;
      const TOKEN_LIST = [ETH_AAVE_ADDR, ETH_MATIC_ADDR, ETH_USDC_ADDR];

      const requestPayload = {
        tokens: TOKEN_LIST,
        chainId: ETH_CHAIN_ID,
      };

      const expected = {
        errored: false,
        error: '',
        items: [
          {
            address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
            eth: 0.0484501,
            eur: 58.75,
            gbp: 50.59,
            usd: 62.31
          },
          {
            address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
            eth: 0.00069803,
            eur: 0.846292,
            gbp: 0.728767,
            usd: 0.898218
          },
          {
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            eth: 0.00077781,
            eur: 0.943011,
            gbp: 0.812054,
            usd: 1.001
          }
        ]
      };

      mockedSDK.services.ratesService.fetchExchangeRates.mockResolvedValueOnce(expected);

      const rates: RateData = await mockedSDK.fetchExchangeRates(requestPayload);
      expect(rates).toStrictEqual(expected);
    });
  });
});
