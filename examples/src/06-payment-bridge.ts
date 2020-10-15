import { Sdk } from '../../src';
import { logger, randomWallet } from './common';

async function main(): Promise<void> {
  const sourceHubSdk = new Sdk(randomWallet());

  await sourceHubSdk.getRelayedTransactions({
    account: null,
    page: null,
  });
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
