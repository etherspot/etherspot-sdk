import { Wallet } from 'ethers';
import { Sdk } from '../../src';
import { logger, topUpAccount, getBalance, randomAddress } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet);
  const { state } = sdk;

  logger.log('key account', state.account);

  logger.log(
    'contract account',
    await sdk.computeContractAccount({
      sync: false,
    }),
  );

  await sdk.syncAccount();

  logger.log('synced contract account', state.account);
  logger.log('synced contract account member', state.accountMember);

  logger.log(
    'get account',
    await sdk.getAccount({
      address: state.accountAddress,
    }),
  );
  logger.log(
    'get account members',
    await sdk.getAccountMembers({
      account: state.accountAddress,
    }),
  );

  await topUpAccount(state.accountAddress, '0.5');

  logger.log('contract account balance', await getBalance(state.accountAddress));

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
