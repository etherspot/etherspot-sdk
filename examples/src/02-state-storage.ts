import { Wallet } from 'ethers';
import { Sdk, StateStorage } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('wallet', wallet.address);

  const storageMock: Partial<Storage> = {
    data: new Map<string, string>(),
    setItem(key: string, value: string) {
      this.data.set(key, value);
    },
    getItem(key: string): string {
      return this.data.get(key);
    },
  };

  const stateStorage: StateStorage = {
    getState: async (walletAddress, networkName) => {
      let result: any = null;

      if (walletAddress && networkName) {
        const plain = storageMock.getItem(`${walletAddress}:${networkName}`);

        if (plain) {
          result = JSON.parse(plain);
        }
      }
      return result;
    },

    setState: async (walletAddress, networkName, state) => {
      if (walletAddress && networkName) {
        storageMock.setItem(`${walletAddress}:${networkName}`, JSON.stringify(state));
      }
    },
  };

  // set sdk state
  {
    const sdk = new Sdk(wallet, {
      stateStorage,
    });

    await sdk.syncAccount();

    await sdk.computeContractAccount({
      sync: true,
    });
  }

  // restore sdk state
  {
    const sdk = new Sdk(wallet, {
      stateStorage,
    });

    sdk.state$.subscribe((state) => logger.log('sdk state', state));
  }
}

main().catch(logger.error);
