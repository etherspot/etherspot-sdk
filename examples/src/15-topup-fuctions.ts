import { NetworkNames, Sdk } from '../../src';
import { logger, deployToken, getPrivateKeyWallet, balanceOf } from './common';

async function main(): Promise<void> {
  // default hardhat local network signer privatekey
  const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const wallet = getPrivateKeyWallet(privateKey, NetworkNames.LocalA);

  const sdk = new Sdk(wallet);
  await sdk.computeContractAccount({ sync: false });
  const tokenAddress = await deployToken(wallet);

  await balanceOf(wallet, tokenAddress);

  await sdk.topUp('10');

  await sdk.topUpP2P('10');

  await sdk.topUpToken('1', tokenAddress);
  await balanceOf(wallet, tokenAddress);

  await sdk.topUpTokenP2P('1', tokenAddress);
  await balanceOf(wallet, tokenAddress);
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
