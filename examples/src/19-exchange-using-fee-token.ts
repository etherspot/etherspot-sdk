import { BigNumber, Wallet, constants, ethers } from 'ethers';
import { EnvNames, NetworkNames, Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();
  const sdk = new Sdk(wallet, {
    env: EnvNames.MainNets,
    networkName: NetworkNames.Matic,
  });

  await sdk.computeContractAccount();
  const exchangeSupportedAssets = await sdk.getExchangeSupportedAssets({ page: 1, limit: 100 });
  logger.log('found exchange supported assets', exchangeSupportedAssets.items.length);

  // NOTE: use ethers.constants.AddressZero for ETH
  const fromTokenAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // USDC
  const toTokenAddress = constants.AddressZero; // ETH
  const fromAmount = ethers.utils.parseUnits('5', 6); // 5 USDC

  const offers = await sdk.getExchangeOffers({
    fromTokenAddress,
    toTokenAddress,
    fromAmount: BigNumber.from(fromAmount),
  });
  console.log('offers: ', offers);
  const offer = offers[0]; // Selected the first offer that we got
  console.log(
    'selected exchange offers',
    offer,
    offer.transactions,
  );
  await sdk.clearGatewayBatch();
  await sdk.batchExecuteAccountTransaction(offer.transactions[0]);
  await sdk.batchExecuteAccountTransaction(offer.transactions[1]);
  const estimation = await sdk.estimateGatewayBatch({ feeToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' }); // pay gas using USDC
  console.log('estimate: ', estimation);
  await sdk.submitGatewayBatch();

}

main()
  .catch(logger.error)
  .finally(() => process.exit());
