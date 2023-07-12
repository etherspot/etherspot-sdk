import { EnvNames, NetworkNames, Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const PRIVATE_KEY = ''; //Privite key Example: get from metamask

  const sdk = new Sdk(PRIVATE_KEY, { env: EnvNames.LocalNets, networkName: NetworkNames.Mumbai });

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
    'get account investments',
    await sdk.getAccountInvestments({
      account: state.accountAddress, //Smart wallet address
      chainId: 1, //Linked chain id
      provider: '', //specific provider optional
      apps: [], //filter by apps optional
    }),
  );
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
