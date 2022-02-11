import { BigNumber, Wallet, constants } from 'ethers';
import { EnvNames, NetworkNames, Sdk } from '../../src';
import { logger, topUpAccount, randomAddress } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();
  const sdk = new Sdk(wallet, {
    env: EnvNames.MainNets,
    networkName: NetworkNames.Mainnet,
  });

  await sdk.computeContractAccount();

  // export const mapTransactionsToTransactionPayload = (
  //   chain: Chain,
  //   transactions: EthereumTransaction[],
  // ): TransactionPayload => {
  //   let transactionPayload = mapTransactionToTransactionPayload(chain, transactions[0]);
  
  //   if (transactions.length > 1) {
  //     transactionPayload = {
  //       ...transactionPayload,
  //       sequentialTransactions: transactions.slice(1).map((
  //         transaction,
  //       ) => mapTransactionToTransactionPayload(chain, transaction)),
  //     };
  //   }
  
  //   return { ...transactionPayload, chain };
  // };

  // const mapDispatchToProps = (dispatch: Dispatch): $Shape<Props> => ({
  //   sendAsset: (
  //     transaction: TransactionPayload,
  //     privateKey: string,
  //     callback: (status: TransactionStatus) => void,
  //   ) => dispatch(sendAssetAction(transaction, privateKey, callback)),
  //   resetIncorrectPassword: () => dispatch(resetIncorrectPasswordAction()),
  //   logEvent: (name: string, properties: Object) => dispatch(logEventAction(name, properties)),
  // });

  // const keyBasedWallet = new KeyBasedWallet(privateKey);
  //         const { transactionEstimate: { feeInfo } } = getState();
  //         transactionResult = await keyBasedWallet.sendTransaction(transaction, accountAddress, feeInfo);

  const exchangeSupportedAssets = await sdk.getExchangeSupportedAssets({ page: 1, limit: 100 });
  logger.log('found exchange supported assets', exchangeSupportedAssets.items.length);

  // NOTE: use ethers.constants.AddressZero for ETH
  // const fromTokenAddress = '0xD71eCFF9342A5Ced620049e616c5035F1dB98620'; // sEUR
  // const toTokenAddress = '0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb'; // sETH
  const fromTokenAddress = '0xe3818504c1b32bf1557b16c238b2e01fd3149c17'; // PLR
  const toTokenAddress = constants.AddressZero; // ETH
  const fromAmount = '5000000000000000000000';


  const offers = await sdk.getExchangeOffers({
    fromTokenAddress,
    toTokenAddress,
    fromAmount: BigNumber.from(fromAmount),
  });
  const offerTransactions = offers[0].transactions;

 //1
  // const mapTransactionToTransactionPayload = (
  //   chain: Chain,
  //   transaction: EthereumTransaction,
  // ): TransactionPayload => {
  //   const { symbol, decimals } = nativeAssetPerChain[chain];
  //   const { to, value, data } = transaction;
  //   const amount = fromEthersBigNumber(value, decimals).toFixed();
  
  //   return { to, amount, symbol, data, decimals };
  // };

  //2 
  //   let transactionPayload = mapTransactionToTransactionPayload(chain, transactions[0]);
  
  //   if (transactions.length > 1) {
  //     transactionPayload = {
  //       ...transactionPayload,
  //       sequentialTransactions: transactions.slice(1).map((
  //         transaction,
  //       ) => mapTransactionToTransactionPayload(chain, transaction)),
  //     };
  //   }


  logger.log('exchange offers', offers);

  logger.log('transaction request', offerTransactions);

  logger.log('gateway batch', await sdk.batchExecuteAccountTransaction(offerTransactions));

  logger.log('estimated batch', await sdk.estimateGatewayBatch());

  const submittedBatch = await sdk.submitGatewayBatch();

  const { hash } = submittedBatch;



}

// main()
//   .catch(logger.error)
//   .finally(() => process.exit());


// // Submit a random transaction that will be automatically delayed by 20 seconds
// logger.log(
//   'batch',
//   await sdk.batchExecuteAccountTransaction({
//     to: randomAddress(),
//     value: utils.parseEther('0.001'),
//   }),
// );

// logger.log('estimated batch', await sdk.estimateGatewayBatch());

// const batch = await sdk.submitGatewayBatch();
// logger.log('submitted batch', batch.hash);

// // Now we can cancel that transaction
// logger.log('cancel batch', await sdk.cancelGatewayBatch({ hash: batch.hash }));

//   // OR proceed it immediately (uncomment for that and comment out batch canceling section)
//   // logger.log('force proceed batch', await sdk.forceGatewayBatch({ hash: batch.hash }));
// }

main()
  .catch(logger.error)
  .finally(() => process.exit());
