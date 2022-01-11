/* eslint-disable @typescript-eslint/no-use-before-define */
import { providers, utils, Wallet } from 'ethers';
import { Sdk } from '../../src';
import { getBalance, logger, randomPrivateKey, topUpAccount } from './common';

async function main(): Promise<void> {
  const providerUrl = 'http://localhost:8545/';
  const provider = new providers.JsonRpcProvider(providerUrl);

  const hubPk = randomPrivateKey();
  const senderPk = randomPrivateKey();
  const recipientPk = randomPrivateKey();

  const hubWallet = new Wallet(hubPk, provider);
  const senderWallet = new Wallet(senderPk, provider);
  const recipientWallet = new Wallet(recipientPk, provider);

  const hubSdk = new Sdk(hubWallet);
  const senderSdk = new Sdk(senderWallet);
  const recipientSdk = new Sdk(recipientWallet);

  const { state: hubState } = hubSdk;
  const { state: senderState } = senderSdk;
  const { state: recipientState } = recipientSdk;

  // NOTE: until we don't call the computeContractAccount(), accountAddress will show the key based wallet's address
  const { accountAddress: hub } = hubState;
  const { accountAddress: sender } = senderState;
  const { accountAddress: recipient } = recipientState;

  // Step 1: Setup
  await topUpAll();
  await logData();

  // Step 2: Hub locks 40 ETH as liquidity
  await provideHubLiquidity();
  await logData();

  // Step 3: Alice deposits 10 ETH
  await depositToHub(10);
  await logData();

  // Step 4: Hub settles Alice's deposit
  // NOTE: that action is optional, it just updates the liquidity
  await settleDeposit();
  await logData();

  // Step 5: Alice sends to Bob 10 ETH
  await makePayment(1, recipient);
  await logData();

  // Step 6: Bob withdraws
  await withdrawPayment();
  await logData();

  // -- //
  async function topUpAll() {
    await topUpAccount(hubState.accountAddress, '1');
    await topUpAccount(hubState.p2pPaymentDepositAddress, '100');
    await topUpAccount(senderState.p2pPaymentDepositAddress, '50');
    await topUpAccount(recipientState.accountAddress, '1');
  }

  async function provideHubLiquidity() {
    logger.log(
      'payment hub',
      await hubSdk.updatePaymentHub({
        liquidity: utils.parseEther('40'),
      }),
    );
  }

  async function depositToHub(amount) {
    logger.log(
      'payment hub sender deposit',
      await senderSdk.updatePaymentHubDeposit({
        hub,
        totalAmount: utils.parseEther(amount.toString()),
      }),
    );
  }

  async function settleDeposit() {
    const {
      items: [paymentChannel],
    } = await hubSdk.getP2PPaymentChannels({ uncommittedOnly: true });

    const { hash } = paymentChannel;
    await hubSdk.computeContractAccount({ sync: false });
    const batch = await hubSdk.batchCommitP2PPaymentChannel({ hash });

    const encoded = batch.requests[0];
    logger.log('tx', await hubWallet.sendTransaction(encoded));
  }

  async function makePayment(amount, recipient) {
    logger.log(
      'payment hub payment',
      await senderSdk.createPaymentHubPayment({
        hub,
        recipient,
        value: utils.parseEther(amount.toString()),
      }),
    );
  }

  async function withdrawPayment() {
    // NOTE: we can't call it twice
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

    await recipientSdk.computeContractAccount();

    // NOTE: that requires to call the computeContractAccount() first
    const batch = await recipientSdk.batchCommitP2PPaymentChannel({
      hash,
      deposit: false,
    });

    const encoded = batch.requests[0]; // send directly to PaymentRegistry
    console.log(await recipientWallet.sendTransaction(encoded));

    /**
     * There is an option to send transaction via the Gateway contract
     * that would allow to batch multiple calls.
     * In order to get it working we should avoid calling the recipientSdk.computeContractAccount()
     * and disable requirement for 'contractAccount: true' in batchCommitP2PPaymentChannel and encodeGatewayBatch
     * TODO: check if we can pass a flag to override those requirements or maybe call some methods directly
     */
    // const encoded = await recipientSdk.encodeGatewayBatch({ delegate: false });
    // console.log(await recipientWallet.sendTransaction(encoded));
  }

  async function logData() {
    // hub
    logger.log('hub P2P balance', await getBalance(hubState.p2pPaymentDepositAddress).then(utils.formatEther));
    logger.log('hub payment deposits', await hubSdk.getP2PPaymentDeposits());
    logger.log(
      'hub liquidity',
      await hubSdk.getPaymentHub({ hub }).then(({ liquidity }) => utils.formatEther(liquidity)),
    );

    // sender
    logger.log('sender payment deposits', await senderSdk.getP2PPaymentDeposits());
    logger.log(
      'sender total amount on hub',
      await senderSdk.getPaymentHubDeposit({ hub }).then(({ totalAmount }) => utils.formatEther(totalAmount)),
    );
    logger.log('sender P2P balance', await getBalance(senderState.p2pPaymentDepositAddress).then(utils.formatEther));
    logger.log('sender balance', await getBalance(recipient).then(utils.formatEther));

    // recipient
    logger.log('recipient balance', await getBalance(recipient).then(utils.formatEther));
  }
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
