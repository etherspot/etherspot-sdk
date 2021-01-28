import { Wallet } from 'ethers';
import { Sdk } from '../../src';
import { logger, topUpAccount } from './common';

async function main(): Promise<void> {
  const senderSdk = new Sdk(Wallet.createRandom());
  const recipientSdk = new Sdk(Wallet.createRandom());

  const { state: senderState } = senderSdk;
  const { state: recipientState } = recipientSdk;

  logger.log(
    'sender contract account',
    await senderSdk.computeContractAccount({
      sync: false,
    }),
  );
  logger.log(
    'recipient contract account',
    await recipientSdk.computeContractAccount({
      sync: false,
    }),
  );

  await topUpAccount(recipientState.accountAddress, '0.5');
  await topUpAccount(senderState.p2pPaymentDepositAddress, '2');

  const partialPaymentValue = 100;
  const partialPaymentCount = 5;

  let hash: string;

  for (let index = 1; index <= partialPaymentCount; index++) {
    const totalAmount = index * partialPaymentValue;
    const paymentChannel = await senderSdk.updateP2PPaymentChannel({
      totalAmount,
      recipient: recipientState.accountAddress,
    });

    if (!hash) {
      ({ hash } = paymentChannel);
    }

    logger.log(`payment channel #${index}`, paymentChannel);
  }

  logger.log(
    'batch',
    await recipientSdk.batchCommitP2PPaymentChannel({
      hash,
      deposit: true,
    }),
  );
  logger.log('estimated batch', await recipientSdk.estimateGatewayBatch());

  logger.log('submitted batch', await recipientSdk.submitGatewayBatch());

  logger.log(
    'batch',
    await senderSdk.batchWithdrawP2PPaymentDeposit({
      amount: 100,
    }),
  );

  logger.log('estimated batch', await senderSdk.estimateGatewayBatch());

  logger.log('submitted batch', await senderSdk.submitGatewayBatch());
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
