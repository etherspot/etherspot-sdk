import { Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const sdk = new Sdk();

  // random wallet
  const wallet = sdk.createWallet();

  logger.log('wallet', wallet.address);

  const ensNode = await sdk.reserveENSName(`random${Date.now().toString(16)}.pillar.dev`);

  logger.log('ensNode', ensNode);
}

main().catch(logger.error);
