import { utils } from 'ethers';
import { BatchCommitPaymentChannelModes, Sdk } from '../../src';
import { logger, topUpAccount, randomWallet } from './common';

async function main(): Promise<void> {
  const hubSdk = new Sdk(randomWallet());
  const senderSdk = new Sdk(randomWallet());
  const recipientSdk = new Sdk(randomWallet());

  const { state: hubState } = hubSdk;
  const { state: senderState } = senderSdk;
  const { state: recipientState } = recipientSdk;

  await recipientSdk.computeContractAccount();

  await topUpAccount(hubState.p2pPaymentDepositAddress, '10');
  await topUpAccount(senderState.p2pPaymentDepositAddress, '5');
  await topUpAccount(recipientState.accountAddress, '1');

  const { accountAddress: hub } = hubState;
  const { accountAddress: sender } = senderState;
  const { accountAddress: recipient } = recipientState;

  logger.log('payment hub', await hubSdk.updatePaymentHub(utils.parseEther('5')));

  logger.log('payment hub sender deposit', await senderSdk.updatePaymentHubDeposit(hub, utils.parseEther('5')));

  logger.log(
    'payment hub payment (sender > recipient 1 ETH)',
    await senderSdk.createPaymentHubPayment(hub, recipient, utils.parseEther('1')),
  );
  logger.log(
    'payment hub payment (sender > recipient 2 ETH)',
    await senderSdk.createPaymentHubPayment(hub, recipient, utils.parseEther('2')),
  );
  logger.log(
    'payment hub payment (recipient > sender 1.5 ETH)',
    await recipientSdk.createPaymentHubPayment(hub, sender, utils.parseEther('1.5')),
  );

  logger.log('payment hub recipient deposit', await recipientSdk.getPaymentHubDeposit(hub));
  logger.log('payment hub recipient deposit (updated)', await recipientSdk.updatePaymentHubDeposit(hub, 0));

  const {
    items: [paymentHubChannel],
  } = await recipientSdk.getP2PPaymentChannels();

  const { hash } = paymentHubChannel;

  logger.log('payment hub recipient p2p channel', paymentHubChannel);
  logger.log('payment hub recipient p2p channel (signed)', await hubSdk.signP2PPaymentChannel(hash));

  logger.log('batch', await recipientSdk.batchCommitP2PPaymentChannel(hash, BatchCommitPaymentChannelModes.Deposit));
  logger.log('estimated batch', await recipientSdk.estimateBatch());

  logger.log('relayed transaction', await recipientSdk.submitBatch());

  logger.log('recipient balances', await recipientSdk.getAccountBalances());
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
