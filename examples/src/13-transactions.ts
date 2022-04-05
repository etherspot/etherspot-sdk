import { Wallet } from 'ethers';
import { EnvNames, NetworkNames, Sdk } from '../../src';
import { logger, deployToken, getPrivateKeyWallet, randomAddress, balanceOf, topUpAccount } from './common';

async function main(): Promise<void> {
  const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const wallet = getPrivateKeyWallet(privateKey, NetworkNames.LocalA);
  const sdk = new Sdk(wallet);
  await sdk.computeContractAccount({ sync: false });
  await sdk.topUp('10');

  const { state } = sdk;

  logger.log(
    'batch #1',
    await sdk.batchAddAccountOwner({
      owner: randomAddress(),
    }),
  );
  logger.log(
    'batch #2',
    await sdk.batchAddAccountOwner({
      owner: randomAddress(),
    }),
  );
  logger.log('estimated batch', await sdk.estimateGatewayBatch());

  logger.log('submitted batch', await sdk.submitGatewayBatch());


  // // const account = '0xc7cE2cB91402B1249f5271c89b7e4fad3548Afe7';
  const transactions = await sdk.getTransactions({ account:state.accountAddress });

  logger.log('transactions', transactions);
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
