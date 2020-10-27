import { Wallet } from 'ethers';
import { Sdk } from '../../src';
import { logger, topUpAccount, randomAddress } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet, {
    project: {
      key: 'echo',
      metadata: 'test',
    },
  });
  const { state } = sdk;

  logger.log(
    'contract account',
    await sdk.computeContractAccount({
      sync: false,
    }),
  );

  await topUpAccount(state.accountAddress, '0.5');

  logger.log(
    'batch #1',
    await sdk.batchAddAccountOwner({
      owner: randomAddress(),
    }),
  );
  logger.log(
    'batch #2',
    await sdk.batchAddAccountOwner({
      owner: randomAddress(),
    }),
  );
  logger.log('estimated batch', await sdk.estimateBatch());

  logger.log('relayed transaction', await sdk.submitBatch());
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
