import { BigNumber, Wallet, constants } from 'ethers';
import { EnvNames, NetworkNames, Sdk } from '../../src';
import { logger, mapTransactionsToTransactionPayload } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.fromMnemonic('test test test test test test test test test test test junk');
  const wallet2 = Wallet.createRandom();
  console.log(wallet.privateKey);
  console.log(wallet.address);
  // const sdk = new Sdk(wallet);
  // logger.info('sending batch using owner wallet');

  const sdkMainnet = new Sdk(wallet2, {
    env: EnvNames.MainNets,
    networkName: NetworkNames.Matic,
  });

  const sdk = new Sdk(wallet, {
    env: EnvNames.LocalNets,
    networkName: NetworkNames.LocalA,
  });

  await sdk.computeContractAccount();
  await sdkMainnet.computeContractAccount();

  await sdk.syncAccount();

  const exchangeSupportedAssets = await sdkMainnet.getExchangeSupportedAssets({ page: 1, limit: 100 });
  logger.log('found exchange supported assets', exchangeSupportedAssets.items.length);

  // NOTE: use ethers.constants.AddressZero for ETH
  // const fromTokenAddress = '0xD71eCFF9342A5Ced620049e616c5035F1dB98620'; // sEUR
  // const toTokenAddress = '0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb'; // sETH
  const pillarToken = '0xe3818504c1b32bf1557b16c238b2e01fd3149c17'; // PLR
  const wrappedMatic = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270' // Polygon: WMATIC Token https://polygonscan.com/address/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270
  const PillarPostoken = '0xa6b37fC85d870711C56FbcB8afe2f8dB049AE774'; // Pillar: PLR Token 
  const eth = constants.AddressZero; // ETH
  const fromAmount = '5000000000000000000000';

  const offers = await sdkMainnet.getExchangeOffers({
    fromTokenAddress:wrappedMatic,
    toTokenAddress:PillarPostoken,
    fromAmount: BigNumber.from(fromAmount),
  });

  // const offers2 = await sdk.getExchangeOffers({
  //   fromTokenAddress,
  //   toTokenAddress,
  //   fromAmount: BigNumber.from(fromAmount),
  // });
  console.log('offers -----------------');
  console.log(offers);

  // if(false) {
  logger.log('exchange offers', offers[0]);

  const offerTransactions = offers[0].transactions;
  // logger.log('exchange offers 0', offers[0].transactions[1]);
  // logger.log('exchange offers 1', offers[1].transactions[1]);
  // logger.log('exchange offers 2', offers[2].transactions[1]);
  // logger.log('exchange 3', offers[3]);
  // logger.log('exchange offers 3', offers[3].transactions[1]);

  const fromAccountAddress = wallet.address;

  const transactionPayload = await mapTransactionsToTransactionPayload('ethereum', offerTransactions);
  logger.log('transaction request', transactionPayload);

  await sdk.batchDeployAccount();

  await sdk.batchExecuteAccountTransaction(transactionPayload);

  // trigger swap bussiness logic
  logger.log('estimated batch', await sdk.estimateGatewayBatch());

  // submit current batch
  // const { hash: batchHash } = await sdk.submitGatewayBatch();

  // console.log(batchHash)
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
