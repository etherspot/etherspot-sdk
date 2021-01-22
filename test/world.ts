import { World as BaseWorld, setWorldConstructor } from '@cucumber/cucumber';
import { providers, utils, Wallet } from 'ethers';
import { EnvNames, Sdk, NetworkNames } from '../src';
import {
  LOCAL_A_FAUCET_PRIVATE_KEY,
  LOCAL_A_PROVIDER_ENDPOINT,
  LOCAL_B_FAUCET_PRIVATE_KEY,
  LOCAL_B_PROVIDER_ENDPOINT,
} from './config';

export class World extends BaseWorld {
  private sdkInstances = new Map<string, Sdk>();

  private networks: {
    [key: string]: {
      faucetWallet: Wallet;
    };
  } = {
    [NetworkNames.LocalA]: {
      faucetWallet: new Wallet(LOCAL_A_FAUCET_PRIVATE_KEY, new providers.JsonRpcProvider(LOCAL_A_PROVIDER_ENDPOINT)),
    },
    [NetworkNames.LocalB]: {
      faucetWallet: new Wallet(LOCAL_B_FAUCET_PRIVATE_KEY, new providers.JsonRpcProvider(LOCAL_B_PROVIDER_ENDPOINT)),
    },
  };

  async createSdkInstance(name: string, balance: string = null): Promise<Sdk> {
    const privateKey = utils.hexlify(utils.randomBytes(32));

    const sdk = new Sdk(privateKey, {
      env: EnvNames.LocalNets,
    });

    this.sdkInstances.set(name, sdk);

    await sdk.computeContractAccount({
      sync: true,
    });

    if (balance) {
      const { accountAddress } = sdk.state;
      await this.topUp(accountAddress, balance);
    }

    return sdk;
  }

  getSdkInstance(name: string): Sdk {
    return this.sdkInstances.get(name);
  }

  async topUp(to: string, value: string, network: NetworkNames = NetworkNames.LocalA): Promise<void> {
    const { faucetWallet } = this.networks[network];

    const tx = await faucetWallet.sendTransaction({
      to,
      value: utils.parseEther(value),
    });

    await tx.wait();
  }
}

setWorldConstructor(World);
