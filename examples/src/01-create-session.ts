import { Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const sdk = new Sdk();

  // random wallet
  const wallet = sdk.generateWallet();

  // const PRIVATE_KEY = '0x...';
  // const wallet = sdk.createWallet(PRIVATE_KEY);

  logger.log('wallet.address', wallet.address);

  const session = await sdk.createSession();

  logger.log('session', session);
}

main().catch(logger.error);
