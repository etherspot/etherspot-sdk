import { Wallet } from 'ethers';
import { take } from 'rxjs/operators';
import { Sdk } from '../../src';
import { logger, topUpAccount } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet);

  const { state } = sdk;

  const ensRootNode = await sdk.getENSNode({
    nameOrHashOrAddress: 'pillar.test',
  });

  if (!ensRootNode || !ensRootNode.state) {
    logger.info('ens root node pillar.test not found');
    return;
  }

  logger.log('ens root node', ensRootNode);

  const notification = sdk.notifications$.pipe(take(1)).toPromise();

  logger.log(
    'contract account',
    await sdk.computeContractAccount({
      sync: false,
    }),
  );

  await topUpAccount(state.accountAddress, '0.5');

  const ensName = `random${Date.now().toString(16)}.pillar.test`;

  const ensNode = await sdk.reserveENSName({
    name: ensName,
  });

  logger.log('ens node', ensNode);

  logger.log('last notification', await notification);

  logger.log(
    'batch',
    await sdk.batchClaimENSNode({
      nameOrHashOrAddress: ensName,
    }),
  );
  logger.log('estimated batch', await sdk.estimateGatewayBatch());

  logger.log('submitted batch', await sdk.submitGatewayBatch());
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
