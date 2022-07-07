import { BigNumberish, utils } from 'ethers';
import { ContractNames, getContractAbi } from '@etherspot/contracts';
import { EnvNames, NetworkNames, Sdk, NETWORK_NAME_TO_CHAIN_ID, BridgingQuotes, CrossChainServiceProvider } from '../../src';
import { logger } from './common';
import * as dotenv from 'dotenv';
import { TransactionRequest } from '@ethersproject/abstract-provider';
dotenv.config();

export interface ERC20Contract {
  encodeApprove?(spender: string, value: BigNumberish): TransactionRequest;
  callAllowance?(owner: string, spender: string): Promise<string>;
}

async function main(): Promise<void> {
  if (!process.env.MATIC_PRIVATE_KEY) {
    console.log('private key missing');
    return null;
  }
  const privateKey = process.env.XDAI_PRIVATE_KEY;

  const sdk = new Sdk({ privateKey: privateKey }, { env: EnvNames.MainNets, networkName: NetworkNames.Matic });

  const { state } = sdk;

  logger.log('key account', state.account);

  logger.log(
    'contract account',
    await sdk.computeContractAccount({
      sync: false,
    }),
  );

  await sdk.syncAccount();

  logger.log('synced contract account', state.account);
  logger.log('synced contract account member', state.accountMember);

  const XdaiUSDC = '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83'; // Xdai - USDC
  const MaticUSDC = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // Matic - USDC

  const fromChainId: number = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Matic];
  const toChainId: number = NETWORK_NAME_TO_CHAIN_ID[NetworkNames.Xdai];
  const fromTokenAddress: string = MaticUSDC;
  const toTokenAddress: string = XdaiUSDC;

  // MATIC USDC has 6 decimals
  const fromAmount = utils.parseUnits('1', 6); // 10 USDC

  /*
  * Optional parameter - serviceProvider
  * Will return quotes from all services provided if not specified
  */
  const quoteRequestPayload = {
    fromChainId: fromChainId,
    toChainId: toChainId,
    fromTokenAddress: fromTokenAddress,
    toTokenAddress: toTokenAddress,
    fromAmount: fromAmount,
    serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
  };
  console.log(quoteRequestPayload);
  const quotes: BridgingQuotes = await sdk.getCrossChainQuotes(quoteRequestPayload);

  console.log('Quotes');
  logger.log('Quotes: ', quotes);

  if(quotes.items.length > 0 ) {
  // Select the first quote
  const quote = quotes.items[0];
  logger.log('Quote Selected: ', quote);

  const tokenAddres = quote.estimate.data.fromToken.address;
  const approvalAddress = quote.approvalData.approvalAddress;
  const amount = quote.approvalData.amount;

  // Build the approval transaction request
  const abi = getContractAbi(ContractNames.ERC20Token);
  const erc20Contract = sdk.registerContract<ERC20Contract>('erc20Contract', abi, tokenAddres);
  const approvalTransactionRequest: TransactionRequest = erc20Contract.encodeApprove(approvalAddress, amount);
  logger.log('Approval transaction request', approvalTransactionRequest);
  await sdk.clearGatewayBatch();
  // Batch the approval transaction
  logger.log(
    'gateway batch approval transaction',
    await sdk.batchExecuteAccountTransaction({
      to: approvalTransactionRequest.to,
      data: approvalTransactionRequest.data,
      value: approvalTransactionRequest.value,
    }),
  );

  // Batch the cross chain transaction
  const { to, value, data }: TransactionRequest = quote.transaction;
  logger.log(
    'gateway batch transfer token transaction',
    await sdk.batchExecuteAccountTransaction({ to, data: data, value }),
  );

  const estimatedGas = await sdk.estimateGatewayBatch();
  // Estimate and submit the transactions to the Gateway
  logger.log('estimated batch', utils.formatEther(estimatedGas.estimation.feeAmount));
  logger.log('submitted batch', await sdk.submitGatewayBatch());
  }
}

main()
  .catch(logger.error)
  .finally(() => process.exit());