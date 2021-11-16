import { Wallet, utils } from 'ethers';
import { Sdk } from '../../src';
import { logger, topUpAccount, randomAddress } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  const sdk = new Sdk(wallet);
  await sdk.computeContractAccount();

  // Update account settings, set 20 seconds delay for future transactions
  const allowedOptions = await sdk.getDelayTransactionOptions();
  logger.log('get delay transaction options', allowedOptions);

  logger.log('get account settings', await sdk.getAccountSettings());

  logger.log(
    'update account settings',
    await sdk.updateAccountSettings({
      delayTransactions: allowedOptions[0],
    }),
  );

  await topUpAccount(sdk.state.accountAddress, '0.5');

  // Submit a random transaction that will be automatically delayed by 20 seconds
  logger.log(
    'batch',
    await sdk.batchExecuteAccountTransaction({
      to: randomAddress(),
      value: utils.parseEther('0.001'),
    }),
  );

  logger.log('estimated batch', await sdk.estimateGatewayBatch());

  const batch = await sdk.submitGatewayBatch();
  logger.log('submitted batch', batch.hash);

  // Now we can cancel that transaction
  logger.log('cancel batch', await sdk.cancelGatewayBatch({ hash: batch.hash }));

  // OR proceed it immediately (uncomment for that and comment out batch canceling section)
  // logger.log('force proceed batch', await sdk.forceGatewayBatch({ hash: batch.hash }));
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
