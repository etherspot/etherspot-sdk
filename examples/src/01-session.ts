import { Wallet } from 'ethers';
import { Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet);

  logger.log('create session', await sdk.createSession());

  logger.log('create session with ttl', await sdk.createSession(100));

  logger.log('export session', sdk.state.session);

  logger.log(
    'restore session',
    await sdk.restoreSession({
      token: '0x964e1fc04d3dc1ef00cd9fb6f7741e01b83ace8c872d84ebb20d2cabe639ac8b',
      ttl: 200,
      expireAt: new Date(Date.now() + 10000),
    }),
  );
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
