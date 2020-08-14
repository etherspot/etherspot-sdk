import { Wallet } from 'ethers';
import { Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  // random wallet
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet);

  const session = await sdk.createSession();

  logger.log('session', session);
}

main().catch(logger.error);
