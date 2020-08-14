import { Wallet } from 'ethers';
import { Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  // random wallet
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet);

  const ensNode = await sdk.reserveENSName(`random${Date.now().toString(16)}.pillar.dev`);

  logger.log('ensNode', ensNode);
}

main().catch(logger.error);
