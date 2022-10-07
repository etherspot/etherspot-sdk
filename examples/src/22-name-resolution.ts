import { Wallet } from 'ethers';
import { Env, EnvNames, NetworkNames, Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();
  logger.log('wallet', wallet.address);

  const sdk = new Sdk(wallet, { env: EnvNames.MainNets, networkName: NetworkNames.Mainnet });

  const ensTopLevelDomains = await sdk.getENSTopLevelDomains();

  if (!ensTopLevelDomains.length) {
    logger.info('ens top level domain not found');
    return;
  }

  logger.log(
    'contract account',
    await sdk.computeContractAccount({
      sync: false,
    }),
  );

  const ensName = `random${Date.now().toString(16)}.${ensTopLevelDomains[0]}`;

  const ensNode = await sdk.reserveENSName({
    name: ensName,
  });

  logger.log('ens node', ensNode);

  // ens support
  logger.log(
    'resolve ens name',
    await sdk.resolveName({
      chainId: 137,
      name: ensNode.name,
    }),
  );

  // unstoppable domains support
  logger.log(
    'resolve name of unstoppable domain',
    await sdk.resolveName({
      name: 'brad.crypto',
    }),
  );

  // fio support
  logger.log(
    'resolve name of fio domain',
    await sdk.resolveName({
      chainId: 137, // ChainId must be mapped with entered domain name and it is supported by the platform too.
      name: 'purse@alice', // This is just sample name. Please pass the correct domain with chaindID
    }),
  );
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
