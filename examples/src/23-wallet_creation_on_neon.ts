import { Wallet } from 'ethers';
import { EnvNames, NetworkNames, Sdk } from '../../src';
import { logger, getBalance } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet, {
      env: EnvNames.TestNets,
      networkName: NetworkNames.NeonDevnet,
  });
  const { state } = sdk;

  logger.log('key account', state.account);

  logger.log(
    'contract account',
    await sdk.computeContractAccount({
      sync: false,
    }),
  );

  logger.log('contract account balance', await getBalance(state.accountAddress));
}

main()
  .catch(logger.error)
  .finally(() => process.exit());