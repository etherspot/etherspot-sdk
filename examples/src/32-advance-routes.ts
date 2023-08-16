import { ethers, utils, Wallet } from 'ethers';
import { EnvNames, NetworkNames, Sdk, NETWORK_NAME_TO_CHAIN_ID } from '../../src';
import { logger } from './common';
import * as dotenv from 'dotenv';
dotenv.config();

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();

  logger.log('sender wallet', wallet.address);

  const sdk = new Sdk(wallet, {
    env: EnvNames.LocalNets,
    networkName: NetworkNames.LocalA,
  });

  const { state } = sdk;

  logger.log('key account', state.account);

  const fromChainId: number = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Mainnet];
  const toChainId: number = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Bsc];

  const fromAmount = utils.parseUnits('1', 18);

  const quoteRequestPayload = {
    fromChainId: fromChainId,
    toChainId: toChainId,
    fromTokenAddress: ethers.constants.AddressZero,
    toTokenAddress: ethers.constants.AddressZero,
    fromAmount: fromAmount,
  };

  const quotes = await sdk.advanceRoutes(quoteRequestPayload);

  logger.log('Advance Routes: ', quotes.items);
}

main()
  .catch(logger.error)