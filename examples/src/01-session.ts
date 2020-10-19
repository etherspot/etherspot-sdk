import { Wallet } from 'ethers';
import { Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet);

  logger.log('create session', await sdk.createSession());

  logger.log(
    'create session with ttl',
    await sdk.createSession({
      ttl: 100,
    }),
  );

  logger.log('export session', sdk.state.session);
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
