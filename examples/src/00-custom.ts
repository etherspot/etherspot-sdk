import { Sdk, SocketTokenDirection } from '../../src';
import { logger, randomWallet } from './common';

async function main(): Promise<void> {
  const ownerWallet = randomWallet();

  const sdk = new Sdk(ownerWallet);

  /** Example url 
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

  // TODO This route is not supported by Etherspot libs/core/src/socket/socket.service.ts Line 262
  const routes = await sdk.findCrossChainBridgeRoutes({
    fromTokenAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    fromChainId: 56,
    toTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    fromAmount: '100000000000000000000',
    userAddress: '0x3e8cB4bd04d81498aB4b94a392c334F5328b237b',
    toChainId: 137,
    disableSwapping: false,
  });

  const callDataPayload = await sdk.buildCrossChainBridgeTransaction(routes[0]);
  console.log(callDataPayload);

  // TODO contract call with the cross chain payload
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
