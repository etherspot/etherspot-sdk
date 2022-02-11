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

import ERC20_CONTRACT_ABI from '../../../src/sdk/abi/erc20.json';

import { AssetType, EthereumTransaction, TransactionPayload, CHAIN, Chain, ASSET_TYPES, encodeContractMethod, nativeAssetPerChain } from './specs/';
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

export async function swapTransaction(
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


export const mapToEthereumTransactions = async (
  transactionPayload: TransactionPayload,
  fromAddress: string,
): Promise<Partial<EthereumTransaction>[]> => {
  const {
    to,
    data,
    symbol,
    amount,
    contractAddress,
    tokenType,
    tokenId,
    decimals = 18,
    sequentialTransactions = [],
    chain = CHAIN.ETHEREUM,
    useLegacyTransferMethod,
  } = transactionPayload;

  const transaction = await buildEthereumTransaction(
    to,
    fromAddress,
    data,
    amount.toString(),
    symbol,
    decimals,
    tokenType,
    contractAddress,
    tokenId,
    chain,
    useLegacyTransferMethod,
  );

  let transactions = [transaction];

  // important: maintain array sequence, this gets mapped into arrays as well by reusing same method
  const mappedSequential = await Promise.all(sequentialTransactions.map((sequential) =>
    mapToEthereumTransactions(sequential, fromAddress),
  ));

  // append sequential to transactions batch
  mappedSequential.forEach((sequential) => {
    transactions = [
      ...transactions,
      ...sequential,
    ];
  });

  return transactions;
};


export const buildEthereumTransaction = async (
  to: string,
  from: string,
  data: string,
  amount: string,
  symbol: string,
  decimals: number = 18,
  tokenType: AssetType,
  contractAddress: string,
  tokenId: string,
  chain: Chain,
  useLegacyTransferMethod?: boolean,
): Promise<Partial<EthereumTransaction>> => {
  let value;

  if (tokenType !== ASSET_TYPES.COLLECTIBLE) {
    const chainNativeSymbol = nativeAssetPerChain[chain].symbol;
    value = utils.parseUnits(amount, decimals);
    if (symbol !== chainNativeSymbol && !data && contractAddress) {
      data = encodeContractMethod(ERC20_CONTRACT_ABI, 'transfer', [to, value.toString()]);
      to = contractAddress;
      value = BigNumber.from(0); // value is in encoded transfer method as data
    }
  } else if (contractAddress && tokenId) {
    // TODO other assets
    // data = await buildERC721TransactionData({
    //   from,
    //   to,
    //   tokenId,
    //   contractAddress,
    //   useLegacyTransferMethod: !!useLegacyTransferMethod,
    // });
    // to = contractAddress;
    // value = EthersBigNumber.from(0);
  }
  type payload = { to:string,value:any, data:string}
  let transaction:Partial<EthereumTransaction> = { to, value };

  if (data) transaction = { to:transaction.to, value:transaction.value , data:data };
  return transaction;
};