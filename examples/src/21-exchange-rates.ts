import { EnvNames, NetworkNames, RateData, Sdk } from '../../src';

import { logger, randomWallet } from './common';

async function main(): Promise<void> {
  const ETH_AAVE_ADDR = '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9';
  const ETH_MATIC_ADDR = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
  const ETH_USDC_ADDR = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

  const TOKEN_LIST = [ETH_AAVE_ADDR, ETH_MATIC_ADDR, ETH_USDC_ADDR];
  const ETH_CHAIN_ID = 1;

  const wallet = randomWallet();
  const sdk = new Sdk(wallet, { env: EnvNames.LocalNets, networkName: NetworkNames.Mainnet });
  await sdk.computeContractAccount();

  const requestPayload = {
    tokenList: TOKEN_LIST,
    chainId: ETH_CHAIN_ID,
  };
  console.log(requestPayload);

  const rates: RateData = await sdk.fetchExchangeRates(requestPayload);

  console.log('Rates');
  console.log('Rates: ', rates);
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
