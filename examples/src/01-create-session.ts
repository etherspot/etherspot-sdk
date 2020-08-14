import { Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const sdk = new Sdk();

  // random wallet
  const wallet = sdk.createWallet();

  logger.log('wallet', wallet.address);

  const session = await sdk.createSession();

  logger.log('session', session);
}

main().catch(logger.error);
