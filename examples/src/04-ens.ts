import { Wallet } from 'ethers';
import { take } from 'rxjs/operators';
import { Sdk } from '../../src';
import { logger, topUpAccount } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet);

  const { state } = sdk;

  const ensTopLevelDomains = await sdk.getENSTopLevelDomains();

  if (!ensTopLevelDomains.length) {
    logger.info('ens top level domain not found');
    return;
  }

  const notification = sdk.notifications$.pipe(take(1)).toPromise();

  logger.log(
    'contract account',
    await sdk.computeContractAccount({
      sync: false,
    }),
  );

  await topUpAccount(state.accountAddress, '0.5');

  const ensName = `random${Date.now().toString(16)}.${ensTopLevelDomains[0]}`;

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

  logger.log('batch', await sdk.batchSetENSRecordName());

  logger.log(
    'batch',
    await sdk.batchSetENSRecordText({
      key: 'key',
      value: 'value',
    }),
  );

  logger.log('batch', await sdk.batchClaimENSReverseName());

  logger.log('estimated batch', await sdk.estimateGatewayBatch());

  logger.log('submitted batch', await sdk.submitGatewayBatch());

  // unstoppable domains support
  logger.log(
    'ens node',
    await sdk.getENSNode({
      nameOrHashOrAddress: 'brad.crypto',
    }),
  );
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
