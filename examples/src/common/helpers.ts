import { ContractNames, getContractAddress } from '@etherspot/contracts';
import { BigNumber, providers, utils, Wallet } from 'ethers';
import { NetworkNames } from '../../../src';
import {
  LOCAL_A_PROVIDER_ENDPOINT,
  LOCAL_A_PROVIDER_CHAIN_ID,
  LOCAL_A_FAUCET_PRIVATE_KEY,
  LOCAL_B_PROVIDER_ENDPOINT,
  LOCAL_B_PROVIDER_CHAIN_ID,
  LOCAL_B_FAUCET_PRIVATE_KEY,
} from './config';

const localAProvider = new providers.JsonRpcProvider(LOCAL_A_PROVIDER_ENDPOINT);
const localAWallet = new Wallet(LOCAL_A_FAUCET_PRIVATE_KEY, localAProvider);

const localBProvider = new providers.JsonRpcProvider(LOCAL_B_PROVIDER_ENDPOINT);
const localBWallet = new Wallet(LOCAL_B_FAUCET_PRIVATE_KEY, localBProvider);

function getProvider(networkName: NetworkNames = NetworkNames.LocalA): providers.JsonRpcProvider {
  let result: providers.JsonRpcProvider = null;

  switch (networkName) {
    case NetworkNames.LocalA:
      result = localAProvider;
      break;

    case NetworkNames.LocalB:
      result = localBProvider;
      break;
  }

  return result;
}

function getWallet(networkName: NetworkNames = NetworkNames.LocalA): Wallet {
  let result: Wallet = null;

  switch (networkName) {
    case NetworkNames.LocalA:
      result = localAWallet;
      break;

    case NetworkNames.LocalB:
      result = localBWallet;
      break;
  }

  return result;
}

export function getTokenAddress(networkName: NetworkNames = NetworkNames.LocalA): string {
  let result: string = null;

  switch (networkName) {
    case NetworkNames.LocalA:
      result = getContractAddress(ContractNames.WrappedWeiToken, LOCAL_A_PROVIDER_CHAIN_ID);
      break;

    case NetworkNames.LocalB:
      result = getContractAddress(ContractNames.WrappedWeiToken, LOCAL_B_PROVIDER_CHAIN_ID);
      break;
  }

  return result;
}

export async function topUpAccount(
  account: string,
  value: string,
  networkName: NetworkNames = NetworkNames.LocalA,
): Promise<void> {
  const wallet = getWallet(networkName);
  const nonce = await wallet.getTransactionCount();

  const response = await wallet.sendTransaction({
    to: account,
    value: utils.parseEther(value),
    nonce,
  });

  await response.wait();
}

export async function getBalance(account: string, networkName: NetworkNames = NetworkNames.LocalA): Promise<BigNumber> {
  return getProvider(networkName).getBalance(account);
}

export function randomPrivateKey(): string {
  return utils.hexlify(utils.randomBytes(32));
}

export function randomWallet(networkName: NetworkNames = NetworkNames.LocalA): Wallet {
  return new Wallet(randomPrivateKey(), getProvider(networkName));
}

export function randomAddress(): string {
  return randomWallet().address;
}
