import { utils } from 'ethers';
import { Sdk } from '../../src';
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

  logger.log(
    'payment hub',
    await hubSdk.updatePaymentHub({
      liquidity: utils.parseEther('5'),
    }),
  );

  logger.log(
    'payment hub sender deposit',
    await senderSdk.updatePaymentHubDeposit({
      hub,
      totalAmount: utils.parseEther('5'),
    }),
  );

  logger.log(
    'payment hub payment (sender > recipient 1 ETH)',
    await senderSdk.createPaymentHubPayment({
      hub,
      recipient,
      value: utils.parseEther('1'),
    }),
  );
  logger.log(
    'payment hub payment (sender > recipient 2 ETH)',
    await senderSdk.createPaymentHubPayment({
      hub,
      recipient,
      value: utils.parseEther('2'),
    }),
  );
  logger.log(
    'payment hub payment (recipient > sender 1.5 ETH)',
    await recipientSdk.createPaymentHubPayment({
      hub,
      recipient: sender,
      value: utils.parseEther('1.5'),
    }),
  );

  logger.log(
    'payment hub recipient deposit',
    await recipientSdk.getPaymentHubDeposit({
      hub,
    }),
  );
  logger.log(
    'payment hub recipient deposit (updated)',
    await recipientSdk.updatePaymentHubDeposit({
      hub,
    }),
  );

  const {
    items: [paymentHubChannel],
  } = await recipientSdk.getP2PPaymentChannels();

  const { hash } = paymentHubChannel;

  logger.log('payment hub recipient p2p channel', paymentHubChannel);
  logger.log(
    'payment hub recipient p2p channel (signed)',
    await hubSdk.signP2PPaymentChannel({
      hash,
    }),
  );

  logger.log(
    'batch',
    await recipientSdk.batchCommitP2PPaymentChannel({
      hash,
    }),
  );
  logger.log('estimated batch', await recipientSdk.estimateGatewayBatch());

  logger.log('submitted batch', await recipientSdk.submitGatewayBatch());

  logger.log('recipient balances', await recipientSdk.getAccountBalances());
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
