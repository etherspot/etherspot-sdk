import { ContractNames, getContractAbi } from '@etherspot/contracts';
import { BigNumberish } from 'ethers';
import { filter, take } from 'rxjs/operators';
import { NetworkNames, NotificationTypes, randomPrivateKey, Sdk, TransactionRequest } from '../../src';
import { getTokenAddress, logger, topUpAccount } from './common';

export interface ERC20Contract {
  encodeApprove?(spender: string, value: BigNumberish): TransactionRequest;
  callAllowance?(owner: string, spender: string): Promise<string>;
}

async function main(): Promise<void> {
  const sdk = new Sdk(randomPrivateKey());

  const batchUpdatedNotification = sdk.notifications$.pipe(
    filter(({ type }) => type === NotificationTypes.GatewayBatchUpdated),
    take(2),
  );

  await sdk.computeContractAccount();

  const { accountAddress } = sdk.state;

  await topUpAccount(accountAddress, '0.5');

  const abi = getContractAbi(ContractNames.ERC20Token);
  const address = getTokenAddress(NetworkNames.LocalA);

  const erc20Contract = sdk.registerContract<ERC20Contract>('erc20Contract', abi, address);

  const transactionRequest = erc20Contract.encodeApprove('0xEEb4801FBc9781EEF20801853C1Cb25faB8A7a3b', 10);

  logger.log('transaction request', transactionRequest);

  logger.log('gateway batch', await sdk.batchExecuteAccountTransaction(transactionRequest));

  logger.log('estimated batch', await sdk.estimateGatewayBatch());

  const submittedBatch = await sdk.submitGatewayBatch();

  const { hash } = submittedBatch;

  logger.log('submitted batch', submittedBatch);

  // wait for batch
  await batchUpdatedNotification.toPromise();

  logger.log(
    'call response',
    await erc20Contract.callAllowance(accountAddress, '0xEEb4801FBc9781EEF20801853C1Cb25faB8A7a3b'),
  );

  logger.log(
    'submitted batch',
    await sdk.getGatewaySubmittedBatch({
      hash,
    }),
  );
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
