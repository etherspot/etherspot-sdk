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
  * https://backend.movr.network/v2/quote?
  * fromChainId=137&
  * fromTokenAddress=0x2791bca1f2de4661ed88a30c99a7a9449aa84174&
  * toChainId=56
  * &toTokenAddress=0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3
  * &fromAmount=100000000
  * &userAddress=0x3e8cB4bd04d81498aB4b94a392c334F5328b237b
  * &uniqueRoutesPerBridge=true
  * &sort=output
 */
 const routes = await sdk.findCrossChainBridgeRoutes({
    fromTokenAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    fromChainId: 137,
    toTokenAddress: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
    fromAmount:100000000,
    userAddress:"0x3e8cB4bd04d81498aB4b94a392c334F5328b237b",
    toChainId:56,
    disableSwapping: false
  });
  console.log(routes);


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
