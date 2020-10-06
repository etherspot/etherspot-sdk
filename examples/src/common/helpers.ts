import { Wallet, providers, utils, BigNumber } from 'ethers';
import { PROVIDER_ENDPOINT, FAUCET_PRIVATE_KEY } from './config';

const provider = new providers.JsonRpcProvider(PROVIDER_ENDPOINT);
const wallet = new Wallet(FAUCET_PRIVATE_KEY, provider);

export async function topUpAccount(account: string, value: string): Promise<void> {
  const nonce = await wallet.getTransactionCount();

  const response = await wallet.sendTransaction({
    to: account,
    value: utils.parseEther(value),
    nonce,
  });

  await response.wait();
}

export async function getBalance(account: string): Promise<BigNumber> {
  return provider.getBalance(account);
}

export function randomPrivateKey(): string {
  return utils.hexlify(utils.randomBytes(32));
}

export function randomWallet(): Wallet {
  return new Wallet(randomPrivateKey(), provider);
}

export function randomAddress(): string {
  return randomWallet().address;
}
