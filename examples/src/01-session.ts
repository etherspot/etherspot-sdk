import { Sdk, randomPrivateKey, SessionStorage } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const sdk = new Sdk(randomPrivateKey(), {
    sessionStorage: new SessionStorage(),
  });

  logger.log('create session', await sdk.createSession());

  logger.log(
    'create session with ttl',
    await sdk.createSession({
      ttl: 100,
    }),
  );

  logger.log(
    'create session with fcm token',
    await sdk.createSession({
      fcmToken: '',
    }),
  );

  logger.log('account', await sdk.syncAccount());
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
