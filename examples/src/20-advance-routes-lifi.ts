import { ethers, utils } from 'ethers';
import { EnvNames, NetworkNames, Sdk, NETWORK_NAME_TO_CHAIN_ID } from '../../src';
import { logger } from './common';
import * as dotenv from 'dotenv';
dotenv.config();

async function main(): Promise<void> {
  if (!process.env.WALLET_PRIVATE_KEY) {
    console.log('private key missing');
    return null;
  }
  
  const sdk = new Sdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { env: EnvNames.MainNets, networkName: NetworkNames.Bsc });

  const { state } = sdk;

  logger.log('key account', state.account);

  logger.log(
    'contract account',
    await sdk.computeContractAccount({
      sync: false,
    }),
  );

  logger.log('synced contract account', state.account);
  logger.log('synced contract account member', state.accountMember);

  const fromChainId: number = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Bsc];
  const toChainId: number = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
  
  const fromAmount = utils.parseUnits('1', 18); //1 Bsc

  
  const quoteRequestPayload = {
    fromChainId: fromChainId,
    toChainId: toChainId,
    fromTokenAddress: ethers.constants.AddressZero,
    toTokenAddress: ethers.constants.AddressZero,
    fromAmount: fromAmount,
  };
  console.log(quoteRequestPayload);
  const quotes = await sdk.getAdvanceRoutesLiFi(quoteRequestPayload);

  logger.log('Quotes: ', quotes.items);

  if (quotes.items.length > 0) {
    const quote = quotes.items[0]; // Selected the first route
    const transactions = await sdk.getStepTransaction({route: quote});
    logger.log('transactions: ', transactions)

    for (const transaction of transactions.items) {
        await sdk.batchExecuteAccountTransaction({
        to: transaction.to,
        data: transaction.data,
        value: transaction.value,
        });
    }
    logger.log('estimate: ', await sdk.estimateGatewayBatch());
    logger.log('submit gateway transaction: ', await sdk.submitGatewayBatch());
  }

}

main()
  .catch(logger.error)