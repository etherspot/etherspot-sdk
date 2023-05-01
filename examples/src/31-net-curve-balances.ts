import { Wallet } from 'ethers';
import { EnvNames, NetworkNames, Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('sender wallet', wallet.address);

  const sdk = new Sdk(wallet, {
    projectKey: 'testProject',
    projectMetadata: 'test',
    env: EnvNames.LocalNets,
    networkName: NetworkNames.LocalA,
  });

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
    'get market details of token',
    await sdk.getAccount24HourNetCurve({
      chainIds: [1], // Linked chain ids (optional)
      account: '',
    }),
  );
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
