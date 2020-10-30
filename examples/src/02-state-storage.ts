import { Wallet } from 'ethers';
import { Sdk, StateStorage } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const stateStorage: StateStorage = {
    getState: async (walletAddress, networkName) => {
      logger.log('get storage state', {
        walletAddress,
        networkName,
      });

      return null;
    },

    setState: async (walletAddress, networkName, state) => {
      logger.log('set storage state', {
        walletAddress,
        networkName,
        state,
      });
    },
  };

  const sdk = new Sdk(wallet, {
    stateStorage,
  });

  await sdk.syncAccount();

  await sdk.computeContractAccount({
    sync: true,
  });
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
