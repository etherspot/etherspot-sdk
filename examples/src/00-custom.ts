import { Sdk, SocketTokenDirection } from '../../src';
import { logger, randomWallet } from './common';

async function main(): Promise<void> {
  const ownerWallet = randomWallet();

  const sdk = new Sdk(ownerWallet);

  // const result = await sdk.isEligibleForAirdrop({ address: ownerWallet.address });

  // const result = await sdk.getNftList({ account: '0xBc7E056a092938A37412B95fA952fb9Cea8FcD4c' });

  // const result = await sdk.getCrossChainBridgeTokenList({
  //   direction: SocketTokenDirection.From,
  //   fromChainId: 1,
  //   toChainId: 10,
  // });
  // console.log(result);

  /**
   * fromChainId=137
   * &fromTokenAddress=0x2791bca1f2de4661ed88a30c99a7a9449aa84174&
   * toChainId=1&
   * toTokenAddress=0xdac17f958d2ee523a2206206994597c13d831ec7
   * &fromAmount=100000000
   * &userAddress=
   * &uniqueRoutesPerBridge=true
   * &sort=gas
   */
  /** 
https://backend.movr.network/v2/quote?
fromTokenAddress=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56
&fromChainId=56
&toTokenAddress=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
&toChainId=137
&fromAmount=100000000000000000000
&userAddress=0x3e8cB4bd04d81498aB4b94a392c334F5328b237b
&uniqueRoutesPerBridge=true
&singleTxOnly=true
 */
  const routes = await sdk.findCrossChainBridgeRoutes({
    fromTokenAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    fromChainId: 56,
    toTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    fromAmount: '100000000000000000000',
    userAddress: '0x3e8cB4bd04d81498aB4b94a392c334F5328b237b',
    toChainId: 137,
    disableSwapping: false,
  });
  console.log(JSON.stringify(routes[0]));
  // console.log(JSON.stringify(routes[0].userTxs[0]));

  const callDataPayload = await sdk.buildCrossChainBridgeTransaction(routes[0]);

  //  const tx = await signer.sendTransaction({
  //   to: apiReturnData.result.tx.to,
  //   data: apiReturnData.result.tx.data,
  // });

  // Initiates transaction on user's frontend which user has to sign
  // const receipt = await tx.wait();
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
