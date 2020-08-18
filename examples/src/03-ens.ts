import { Wallet } from 'ethers';
import { take } from 'rxjs/operators';
import { Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet);

  const notification = sdk.subscribeNotifications().pipe(take(1)).toPromise();

  const ensNode = await sdk.reserveENSName(`random${Date.now().toString(16)}.pillar.dev`);

  logger.log('ensNode', ensNode);

  logger.log('last notification', await notification);
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
