import { Wallet } from 'ethers';
import { EnvNames, NetworkNames, Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();
  const sdk = new Sdk(wallet, {
    env: EnvNames.MainNets,
    networkName: NetworkNames.Mainnet,
  });

  const account = '';
  const transactions = await sdk.getTransactions({ account });

  logger.log('transactions', transactions);
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
