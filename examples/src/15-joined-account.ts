import { Wallet, utils, providers } from 'ethers';
import { Sdk } from '../../src';
import { logger, topUpAccount, randomPrivateKey } from './common';

async function main(): Promise<void> {
  const providerUrl = 'http://localhost:8545/';
  const provider = new providers.JsonRpcProvider(providerUrl);

  const userPk = randomPrivateKey();
  const botPk = randomPrivateKey();
  const userWallet = new Wallet(userPk, provider);
  const botWallet = new Wallet(botPk, provider);

  const userSdk = new Sdk(userPk);
  const botSdk = new Sdk(botPk);

  await userSdk.computeContractAccount();

  await topUpAccount(userSdk.state.accountAddress, '1');
  await topUpAccount(botWallet.address, '1');

  // user adds a bot as his account co-owner
  logger.log(
    'batch',
    await userSdk.batchAddAccountOwner({
      owner: botWallet.address,
    }),
  );

  logger.log('estimated batch1', await userSdk.estimateGatewayBatch());
  logger.log('submitted batch1', await userSdk.submitGatewayBatch());

  // bot connects to user's account and executes a transaction on user's behalf
  await botSdk.joinContractAccount({ address: userWallet.address, sync: false });

  const encoded = await botSdk.encodeExecuteAccountTransaction({
    to: botWallet.address,
    value: utils.parseEther('0.02'),
  });

  logger.log('transaction', await botWallet.sendTransaction(encoded));
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
