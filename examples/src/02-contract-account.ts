import { Wallet } from 'ethers';
import { Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet);

  logger.log('key account', sdk.state.account);

  logger.log('contract account', await sdk.computeContractAccount(false));

  await sdk.syncAccount();

  logger.log('synced contract account', sdk.state.account);
  logger.log('synced contract account member', sdk.state.accountMember);

  logger.log('get account', await sdk.getAccount(sdk.state.accountAddress));
  logger.log('get account members', await sdk.getAccountMembers(sdk.state.accountAddress));
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
