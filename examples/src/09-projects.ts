import { Wallet } from 'ethers';
import { Sdk } from '../../src';
import { logger, topUpAccount, randomAddress, randomPrivateKey } from './common';

async function main(): Promise<void> {
  const projectKey = `project${Date.now().toString(16)}`;

  {
    const wallet = Wallet.createRandom();

    logger.log('project owner wallet', wallet.address);

    const sdk = new Sdk(wallet);

    logger.log(
      'project',
      await sdk.updateProject({
        key: projectKey,
        endpoint: 'http://localhost:4010/',
        privateKey: randomPrivateKey(),
      }),
    );
  }

  {
    const wallet = Wallet.createRandom();

    logger.log('sender wallet', wallet.address);

    const sdk = new Sdk(wallet, {
      projectKey,
      projectMetadata: 'test',
    });

    logger.log('project call', await sdk.callCurrentProject());
    logger.log(
      'project call with custom metadata',
      await sdk.callCurrentProject({
        customProjectMetadata: 'test2',
      }),
    );

    logger.log(
      'project call with payload',
      await sdk.callCurrentProject({
        payload: {
          a: 1,
          b: 2,
        },
      }),
    );

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
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
