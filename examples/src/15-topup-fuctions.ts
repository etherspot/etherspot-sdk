import { Wallet, getDefaultProvider, providers } from 'ethers';
import { EnvNames, NetworkNames, Sdk } from '../../src';
import { logger, randomWallet } from './common';

async function main(): Promise<void> {
 
//   let provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");
//   const signer = provider.getSigner();
  let privateKey = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
//   const wallet = new  Wallet(privateKey);
//   console.log(wallet);
  const wallet = randomWallet(NetworkNames.LocalA);
  const sdk = new Sdk(wallet);
  await sdk.computeContractAccount({sync: false});

  await sdk.topUp("10");

  await sdk.topUpP2P("10");
  
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
