import { Sdk, SocketTokenDirection } from '../../src';
import { logger, randomWallet } from './common';

async function main(): Promise<void> {
  const ownerWallet = randomWallet();

  const sdk = new Sdk(ownerWallet);

  // const result = await sdk.isEligibleForAirdrop({ address: ownerWallet.address });

  // const result = await sdk.getNftList({ account: '0xBc7E056a092938A37412B95fA952fb9Cea8FcD4c' });

  const result = await sdk.getCrossChainBridgeTokenList({
    direction: SocketTokenDirection.From,
    fromChainId: 1,
    toChainId: 10,
  });

  console.log(result);
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
