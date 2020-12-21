import { utils } from 'ethers';
import { NetworkNames, Sdk } from '../../src';
import { logger, randomPrivateKey, topUpAccount } from './common';

async function main(): Promise<void> {
  const hubPrivateKey = randomPrivateKey();
  const senderPrivateKey = randomPrivateKey();

  const hubLocalASdk = new Sdk({
    privateKey: hubPrivateKey,
  });

  const hubLocalBSdk = new Sdk(
    {
      privateKey: hubPrivateKey,
    },
    {
      networkName: NetworkNames.LocalB,
    },
  );

  const senderLocalASdk = new Sdk({
    privateKey: senderPrivateKey,
  });

  const senderLocalBSdk = new Sdk(
    {
      privateKey: senderPrivateKey,
    },
    {
      networkName: NetworkNames.LocalB,
    },
  );

  const recipientLocalBSdk = new Sdk(
    {
      privateKey: randomPrivateKey(),
    },
    {
      networkName: NetworkNames.LocalB,
    },
  );

  await recipientLocalBSdk.computeContractAccount();

  const { state: hubLocalAState } = hubLocalASdk;
  const { state: hubLocalBState } = hubLocalBSdk;
  const { state: senderLocalAState } = senderLocalASdk;
  const { state: recipientLocalBState } = recipientLocalBSdk;

  const { accountAddress: hub } = hubLocalAState;
  const { accountAddress: recipient } = recipientLocalBState;

  await topUpAccount(hubLocalAState.p2pPaymentDepositAddress, '10');
  await topUpAccount(hubLocalBState.p2pPaymentDepositAddress, '10', NetworkNames.LocalB);
  await topUpAccount(senderLocalAState.p2pPaymentDepositAddress, '7');

  logger.log(
    'payment hub localA',
    await hubLocalASdk.updatePaymentHub({
      liquidity: utils.parseEther('7'),
    }),
  );

  logger.log(
    'payment hub localB',
    await hubLocalBSdk.updatePaymentHub({
      liquidity: utils.parseEther('7'),
    }),
  );

  logger.log(
    'payment hub localB bridge',
    await hubLocalBSdk.activatePaymentHubBridge({
      acceptedNetworkName: NetworkNames.LocalA,
    }),
  );

  logger.log(
    'sender localA deposit',
    await senderLocalASdk.updatePaymentHubDeposit({
      hub,
      totalAmount: utils.parseEther('5'),
    }),
  );

  logger.log(
    'sender localA deposit',
    await senderLocalASdk.transferPaymentHubDeposit({
      hub,
      targetHub: hub,
      targetNetworkName: NetworkNames.LocalB,
      value: utils.parseEther('4'),
    }),
  );

  logger.log(
    'sender localB deposit',
    await senderLocalBSdk.getPaymentHubDeposit({
      hub,
    }),
  );

  logger.log(
    'payment hub localB payment (sender > recipient 2 ETH)',
    await senderLocalBSdk.createPaymentHubPayment({
      hub,
      recipient,
      value: utils.parseEther('2'),
    }),
  );

  logger.log(
    'recipient localB deposit',
    await recipientLocalBSdk.getPaymentHubDeposit({
      hub,
    }),
  );

  logger.log(
    'recipient localB deposit',
    await recipientLocalBSdk.updatePaymentHubDeposit({
      hub,
    }),
  );

  const {
    items: [paymentHubChannel],
  } = await recipientLocalBSdk.getP2PPaymentChannels();

  const { hash } = paymentHubChannel;

  logger.log('payment hub localB recipient p2p channel', paymentHubChannel);
  logger.log(
    'payment hub localB recipient p2p channel (signed)',
    await hubLocalBSdk.signP2PPaymentChannel({
      hash,
    }),
  );

  logger.log(
    'batch',
    await recipientLocalBSdk.batchCommitP2PPaymentChannel({
      hash,
      deposit: false,
    }),
  );

  logger.log('estimated batch', await recipientLocalBSdk.estimateGatewayBatch());

  logger.log('submitted batch', await recipientLocalBSdk.submitGatewayBatch());

  logger.log('recipient balances', await recipientLocalBSdk.getAccountBalances());
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
