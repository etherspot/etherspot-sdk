import { BigNumber, Wallet } from 'ethers';
import { EnvNames, NetworkNames, Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();
  const sdk = new Sdk(wallet, {
    env: EnvNames.MainNets,
    networkName: NetworkNames.Mainnet,
  });

  const exchangeSupportedAssets = await sdk.getExchangeSupportedAssets();
  logger.log('found exchange supported assets', exchangeSupportedAssets.length);

  // NOTE: use ethers.constants.AddressZero for ETH
  const fromTokenAddress = '0xD71eCFF9342A5Ced620049e616c5035F1dB98620'; // sEUR
  const toTokenAddress = '0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb'; // sETH
  const fromAmount = '5000000000000000000000';

  logger.log(
    'exchange offers',
    await sdk.getExchangeOffers({
      fromTokenAddress,
      toTokenAddress,
      fromAmount: BigNumber.from(fromAmount),
    }),
  );
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
