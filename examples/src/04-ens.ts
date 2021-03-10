import { Wallet } from 'ethers';
import { take } from 'rxjs/operators';
import { Sdk } from '../../src';
import { logger, topUpAccount } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet);

  const { state, notifications$ } = sdk;

  const ensTopLevelDomains = await sdk.getENSTopLevelDomains();

  if (!ensTopLevelDomains.length) {
    logger.info('ens top level domain not found');
    return;
  }

  let notification = notifications$.pipe(take(2)).toPromise();

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

  // optional
  logger.log('batch', await sdk.batchSetENSRecordName());

  // optional
  logger.log(
    'batch',
    await sdk.batchSetENSRecordText({
      key: 'key',
      value: 'value',
    }),
  );

  notification = notifications$.pipe(take(4)).toPromise();

  // optional
  logger.log('batch', await sdk.batchClaimENSReverseName());

  logger.log('estimated batch', await sdk.estimateGatewayBatch());

  logger.log('submitted batch', await sdk.submitGatewayBatch());

  await notification;

  // unstoppable domains support
  logger.log(
    'ens node',
    await sdk.getENSNode({
      nameOrHashOrAddress: 'brad.crypto',
    }),
  );

  logger.log(
    'ens addresses lookup',
    await sdk.ensAddressesLookup({
      names: [ensName],
    }),
  );

  logger.log(
    'ens names lookup',
    await sdk.ensNamesLookup({
      addresses: [state.accountAddress],
    }),
  );
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
