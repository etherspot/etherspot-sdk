
import { utils as EthersUtils, Wallet as EthersWallet } from 'ethers';
import {
  Sdk as EtherspotSdk,
  NetworkNames,
  Account as EtherspotAccount,
  Accounts as EtherspotAccounts,
  EnvNames,
  ENSNode,
  ENSNodeStates,
  GatewaySubmittedBatch,
  Notification as EtherspotNotification,
  IncreaseP2PPaymentChannelAmountDto,
  NotificationTypes,
  GatewayTransactionStates,
  Transaction as EtherspotTransaction,
  Currencies as EtherspotCurrencies,
  AccountStates,
} from 'etherspot';
import { map } from 'rxjs/operators';
import type { Subscription } from 'rxjs';
import { getEnv } from './configs/envConfig';
import { isValidAddress, toChecksumAddress } from 'ethereumjs-util';

// utils
import { BigNumber} from 'ethers'
import { getEnsName, parseTokenAmount, reportErrorLog } from './utils/common';
import { isProdEnv } from './utils/environment';
import {
  parseTokenListToken,
  appendNativeAssetIfNeeded,
  buildExchangeOffer,
  buildTransactionFeeInfo,
  getChainTokenListName,
} from './utils/etherspot';
import { addressesEqual, findAssetByAddress } from './utils/assets';
import { nativeAssetPerChain } from './utils/chains';
import { mapToEthereumTransactions } from './utils/transactions';
import { getCaptureFee } from './utils/exchange';

// constants
import { ETH } from './constants/assetsConstants';
import { CHAIN, Chain } from './constants/chainConstants';
import { LIQUIDITY_POOLS } from './constants/liquidityPoolsConstants';
import { PROJECT_KEY } from './constants/etherspotConstants';

// types
import type {
  TokenListToken,
  ExchangeOffer as EtherspotExchangeOffer,
  GatewayEstimatedBatch,
  EtherspotAccountTotalBalancesItem,
} from './utils/types/etherspot';
import type { AssetCore, Asset } from './models/Asset';
import type { WalletAssetBalance } from './models/Balances';
import type {  ChainRecord } from './models/Chain';
import type { ExchangeOffer } from './models/Exchange';
import type {
  EthereumTransaction,
  TransactionPayload,
  TransactionResult,
  TransactionFeeInfo,
} from './models/Transaction';
import type { GasPrice } from './models/GasInfo';
import type { NftList } from 'etherspot';

export class EtherspotService {
  sdk: EtherspotSdk;
  subscriptions: { [network: string]: Subscription } = {};
  instances: { [network: string]: EtherspotSdk } = {};
  supportedNetworks: Array<string> = [];

  async init(sdk): Promise<void> { // privateKey?: string, fcmToken: string = null): Promise<void> {
    // const isMainnet = false; //isProdEnv();

    // /**
    //  * Note: This property is assigned here because
    //  * it requires the value of `isProdEnv` which,
    //  * if assigned at class method level - crashes
    //  * the app due to non-instantiation of the getEnv
    //  * function which is called from envConfig.js
    //  */
    // this.supportedNetworks = [
    //   isMainnet ? NetworkNames.Mainnet : NetworkNames.Kovan,
    //   NetworkNames.Bsc,
    //   NetworkNames.Etherspot,
    //   NetworkNames.Matic,
    //   NetworkNames.Xdai,
    //   isMainnet ? NetworkNames.Avalanche : NetworkNames.Fuji,
    // ];

    // const primaryNetworkName = isMainnet ? NetworkNames.Mainnet : NetworkNames.Kovan;

    // /**
    //  * Cycle through the supported networks and build an
    //  * array of instantiated instances
    //  */
    // await Promise.all(
    //   this.supportedNetworks.map(async (networkName:NetworkNames) => {
    //     const env =
    //       networkName !== NetworkNames.Kovan && networkName !== NetworkNames.Fuji
    //         ? EnvNames.MainNets
    //         : EnvNames.TestNets;
    //     this.instances[networkName] = new EtherspotSdk(privateKey, {
    //       env,
    //       networkName,
    //       projectKey: PROJECT_KEY,
    //     });
    //     if (fcmToken) {
    //       try {
    //         await this.instances[networkName].computeContractAccount({ sync: true });
    //       } catch (error) {
    //         reportErrorLog('EtherspotService network init failed at computeContractAccount', { networkName, error });
    //       }
    //     }
    //   }),
    // );

    // Assign the primary instance of the default networkName to `sdk`
    this.sdk = sdk; //this.instances[primaryNetworkName];
  }

  // subscribe(callback: (chain: Chain, notification: EtherspotNotification) => mixed) {
  //   this.supportedNetworks.forEach((networkName) => {
  //     const sdk = this.instances[networkName];
  //     if (!sdk) {
  //       reportErrorLog('EtherspotService subscribe failed: no sdk instance for network name', { networkName });
  //       return;
  //     }

  //     this.unsubscribeNetworkEvents(networkName);

  //     const chain = chainFromNetworkName(networkName);
  //     if (!chain) {
  //       reportErrorLog('EtherspotService subscribe failed: no chain for network name', { networkName });
  //       return;
  //     }

  //     this.subscriptions[networkName] = sdk.notifications$
  //       .pipe(map((notification) => callback(chain, notification)))
  //       .subscribe();
  //   });
  // }

  // unsubscribeNetworkEvents(network: string) {
  //   const subscription = this.subscriptions[network];
  //   if (!subscription) return;
  //   subscription.unsubscribe();
  //   this.subscriptions[network] = null;
  // }

  // unsubscribe() {
  //   this.supportedNetworks.forEach((networkName) => this.unsubscribeNetworkEvents(networkName));
  // }

  getSdkForChain(chain: Chain): EtherspotSdk {
    // const network = networkNameFromChain(chain);
    // if (!network) {
    //   reportErrorLog('EtherspotService getSdkForChain failed: no network', { chain });
    //   return null;
    // }
    // console.log(this.instances)
    // const sdk = this.instances[network];
    // if (!sdk) {
    //   reportErrorLog('EtherspotService getSdkForChain failed: cannot get SDK instance', { chain, network });
    //   return null;
    // }

    return this.sdk;
  }

  getAccountAddress(chain: Chain): string {
    // const sdk = this.getSdkForChain(chain);
    // if (!sdk) return null;

    return this.sdk.state.accountAddress;
  }

  getAccount(chain: Chain): Promise<EtherspotAccount> {
    const sdk = this.getSdkForChain(chain);
    if (!sdk) return null;

    return sdk.getAccount({ address: sdk.state.accountAddress }).catch((error) => {
      reportErrorLog('EtherspotService getAccount failed', { error });
      return null;
    });
  }

  async getAccountPerChains(): Promise<ChainRecord<EtherspotAccount>> {
    const avalanche = await this.getAccount(CHAIN.AVALANCHE);
    const ethereum = await this.getAccount(CHAIN.ETHEREUM);
    const binance = await this.getAccount(CHAIN.BINANCE);
    const polygon = await this.getAccount(CHAIN.POLYGON);
    const xdai = await this.getAccount(CHAIN.XDAI);

    return { ethereum, binance, polygon, xdai, avalanche };
  }

  getAccounts(): Promise<EtherspotAccount[]> {
    return this.sdk
      .getConnectedAccounts()
      .then(({ items }: EtherspotAccounts) => items)
      .catch((error) => {
        reportErrorLog('EtherspotService getAccounts -> getConnectedAccounts failed', { error });
        return null;
      });
  }

  async estimateENSTransactionFee(chain: Chain): Promise<TransactionFeeInfo> {
    const sdk = this.getSdkForChain(chain);
    if (!sdk) {
      reportErrorLog('estimateENSTransactionFee failed: no SDK for chain set');
      throw new Error('error.unableToSetTransaction');
    }
    const { account: etherspotAccount } = sdk.state;
    let ensNode;
    let batch: GatewayEstimatedBatch = null;
    if (isProdEnv() && chain === CHAIN.ETHEREUM && !etherspotAccount?.ensNode) {
      try {
        ensNode = await this.getEnsNode(etherspotAccount.address);
      } catch (error) {
        reportErrorLog('estimateENSTransactionFee -> getEnsNode failed', {
          error,
          chain,
        });
      }
      if (ensNode && ensNode.state === ENSNodeStates.Reserved) {
        try {
          await sdk.batchClaimENSNode({ nameOrHashOrAddress: ensNode.name });
        } catch (error) {
          reportErrorLog('estimateENSTransactionFee -> batchClaimENSNode failed', {
            error,
            chain,
          });
        }
      }
      try {
        const result = await sdk.estimateGatewayBatch();
        batch = result?.estimation;
      } catch (error) {
        let etherspotErrorMessage;
        try {
          // parsing etherspot estimate error based on return scheme
          const errorMessageJson = JSON.parse(error.message.trim());
          [etherspotErrorMessage] = Object.values(errorMessageJson[0].constraints);
        } catch (e) {
          // unable to parse json
        }
        const errorMessage = etherspotErrorMessage || error?.message || 'error.unableToEstimateTransaction';
        reportErrorLog('estimateENSTransactionFee -> estimateGatewayBatch failed', { errorMessage, chain });
        throw new Error(errorMessage);
      }

      if (!batch) {
        reportErrorLog('estimateENSTransactionFee -> estimateTransactionsBatch returned null', {
          batch,
          chain,
        });
        return null;
      }
    }
    return buildTransactionFeeInfo(batch);
  }

  async getBalances(chain: Chain, accountAddress: string, supportedAssets: Asset[]): Promise<WalletAssetBalance[]> {
    const sdk = this.getSdkForChain(chain);
    if (!sdk) return [];

    const assetAddresses = supportedAssets
      // 0x0...0 is default native token address in our assets, but it's not a ERC20 token
      .filter(({ address }) => !addressesEqual(address, nativeAssetPerChain[chain].address))
      .map(({ address }) => address);

    let balancesRequestPayload = {
      account: chain === CHAIN.AVALANCHE ? sdk.state.accountAddress : accountAddress,
    };

    if (assetAddresses.length) {
      balancesRequestPayload = <any>{
        ...balancesRequestPayload,
        tokens: assetAddresses,
      };
    }

    // gets balances by provided token (asset) address and ETH balance regardless
    const accountBalances = await sdk.getAccountBalances(balancesRequestPayload).catch((error) => {
      reportErrorLog('EtherspotService getBalances -> getAccountBalances failed', { error, chain, accountAddress });
      return null;
    });

    if (!accountBalances?.items) {
      return []; // logged above, no balances
    }

    const nativeSymbol = nativeAssetPerChain[chain].symbol;

    return accountBalances.items.reduce((positiveBalances, asset) => {
      const { balance, token } = asset;

      const supportedAsset = supportedAssets.find(({ symbol: supportedSymbol, address: supportedAddress }) => {
        // `token === null` means it's chain native token
        if (token === null) return supportedSymbol === nativeSymbol;
        return addressesEqual(supportedAddress, token);
      });

      if (!supportedAsset) {
        reportErrorLog('EtherspotService getBalances asset mapping failed', {
          chain,
          token,
        });
        return positiveBalances;
      }

      const { decimals, symbol, address } = supportedAsset;

      const positiveBalance = EthersUtils.formatUnits(balance, decimals);

      // no need to return zero balance asset
      if (BigNumber.from(positiveBalance ?? 0).isZero()) {
        return positiveBalances;
      }

      return [...positiveBalances, { symbol, address, balance: positiveBalance }];
    }, []);
  }

  reserveEnsName(username: string): Promise<ENSNode> {
    const fullEnsName = getEnsName(username);
    return this.sdk.reserveENSName({ name: fullEnsName }).catch((error) => {
      reportErrorLog('EtherspotService reserveENSName failed', { error, username, fullEnsName });
      return null;
    });
  }

  getEnsNode(nameOrHashOrAddress: string): Promise<ENSNode> {
    // if it's address – getENSNode accepts only checksum addresses
    const nameOrHashOrChecksumAddress =
      nameOrHashOrAddress.startsWith('0x') && isValidAddress(nameOrHashOrAddress)
        ? toChecksumAddress(nameOrHashOrAddress)
        : nameOrHashOrAddress;

    return this.sdk.getENSNode({ nameOrHashOrAddress: nameOrHashOrChecksumAddress }).catch((error) => {
      reportErrorLog('getENSNode failed', { nameOrHashOrAddress, nameOrHashOrChecksumAddress, error });
      return null;
    });
  }

  isValidEnsName(name: string): Promise<boolean> {
    return this.sdk.validateENSName({ name }).catch((error) => {
      try {
        // eslint-disable-next-line max-len
        // ref https://github.com/etherspot/etherspot-backend-monorepo/blob/f879c0817aa18faa4f75c148131ecb9278184a2c/apps/ms-ens/src/ens.service.spec.ts#L163
        // eslint-disable-next-line i18next/no-literal-string
        const invalidUsernameErrorProperties = ['name', 'address', 'rootNode'];

        const errorMessageJson = JSON.parse(error.message);
        const { property } = errorMessageJson[0];

        if (!invalidUsernameErrorProperties.includes(property)) {
          reportErrorLog('EtherspotService isValidEnsName failed with unknown property', { property, error });
        }
      } catch (messageParseError) {
        reportErrorLog('EtherspotService isValidEnsName failed and error message parse failed', {
          error,
          messageParseError,
        });
      }

      return false;
    });
  }

  clearTransactionsBatch(chain: Chain): void {
    const sdk = this.getSdkForChain(chain);

    if (!sdk) {
      reportErrorLog('clearTransactionsBatch failed: no SDK for chain set', { chain });
      throw new Error('error.unableToResetTransactions');
    }

    sdk.clearGatewayBatch();
  }

  async setTransactionsBatch(chain: Chain, transactions: any[]) {
    const sdk = this.getSdkForChain(chain);

    if (!sdk) {
      reportErrorLog('setTransactionsBatch failed: no SDK for chain set', { transactions, chain });
      throw new Error('error.unableToSetTransaction');
    }

    const { account: etherspotAccount } = sdk.state;
    if (etherspotAccount.state === AccountStates.UnDeployed) {
      /**
       * batchDeployAccount on back-end additionally checks if account is deployed
       * regardless of our state check and either skips or adds deployment transaction.
       */
      await sdk.batchDeployAccount();
    }

    return Promise.all(transactions.map((transaction) => sdk.batchExecuteAccountTransaction(transaction)));
  }

  estimateTransactionsBatch(chain: Chain, useGasTokenAddress?: string): Promise<GatewayEstimatedBatch> {
    const sdk = this.getSdkForChain(chain);
    if (!sdk) {
      reportErrorLog('estimateTransactionsBatch failed: no SDK for chain set', { chain });
      throw new Error('error.unableToEstimateTransaction');
    }
    const refuntT = <any> { refundToken: useGasTokenAddress };
    return sdk
      .estimateGatewayBatch(refuntT)
      .then((result) => result?.estimation)
      .catch((error) => {
        let etherspotErrorMessage;
        try {
          // parsing etherspot estimate error based on return scheme
          const errorMessageJson = JSON.parse(error.message.trim());
          [etherspotErrorMessage] = Object.values(errorMessageJson[0].constraints);
        } catch (e) {
          // unable to parse json
        }

        const errorMessage = etherspotErrorMessage || error?.message || 'error.unableToEstimateTransaction';
        reportErrorLog('estimateTransactionsBatch -> estimateGatewayBatch failed', { errorMessage, chain });
        throw new Error(errorMessage);
      });
  }

  /** High-level method to estimate etherspot-format transaction data. */
  async setTransactionsBatchAndEstimate(
    chain: Chain,
    transactions: EthereumTransaction[],
    useGasTokenAddress?: string,
  ): Promise<TransactionFeeInfo> {
    try {
      this.clearTransactionsBatch(chain);
    } catch (error) {
      reportErrorLog('setTransactionsBatchAndEstimate -> clearTransactionsBatch failed', {
        error,
        chain,
        transactions,
      });
      throw error;
    }

    try {
      await this.setTransactionsBatch(chain, transactions);
    } catch (error) {
      reportErrorLog('setTransactionsBatchAndEstimate -> setTransactionsBatch failed', { error, chain, transactions });
      throw error;
    }

    let batch: GatewayEstimatedBatch = null;
    try {
      batch = await this.estimateTransactionsBatch(chain, useGasTokenAddress);
    } catch (error) {
      reportErrorLog('setTransactionsBatchAndEstimate -> estimateTransactionsBatch failed', {
        error,
        chain,
        transactions,
      });
      throw error;
    }

    if (!batch) {
      reportErrorLog('setTransactionsBatchAndEstimate -> estimateTransactionsBatch returned null', {
        batch,
        chain,
        transactions,
      });
      return null;
    }

    return buildTransactionFeeInfo(batch);
  }

  async setTransactionsBatchAndSend(
    transactions: Partial<EthereumTransaction>[],
    chain: Chain,
    useGasTokenAddress?: string,
  ): Promise<Partial<TransactionResult>> {
    // clear batch
    this.clearTransactionsBatch(chain);

    // set batch
    await this.setTransactionsBatch(chain, transactions).catch((error) => {
      reportErrorLog('setTransactionsBatchAndSend -> setTransactionsBatch failed', { error, transactions, chain });
      throw error;
    });

    // estimate current batch
    await this.estimateTransactionsBatch(chain, useGasTokenAddress);

    const sdk = this.getSdkForChain(chain);
    if (!sdk) {
      reportErrorLog('setTransactionsBatchAndSend failed: no SDK for chain set', { transactions, chain });
      throw new Error('error.unableToSendTransaction');
    }

    // submit current batch
    const { hash: batchHash } = await sdk.submitGatewayBatch();

    return { batchHash };
  }

  async sendP2PTransaction(transaction: TransactionPayload) {
    const { to: recipient, amount, decimals } = transaction;

    const increaseRequest: IncreaseP2PPaymentChannelAmountDto = {
      token: transaction.symbol === ETH ? null : transaction.contractAddress,
      value: parseTokenAmount(amount.toString(), decimals).toString(),
      recipient,
    };

    const { hash } = await this.sdk.increaseP2PPaymentChannelAmount(increaseRequest);

    return { hash };
  }

  async sendTransaction(
    transaction: TransactionPayload,
    fromAccountAddress: string,
    chain: Chain,
    isP2P?: boolean,
  ): Promise<TransactionResult> {
    if (isP2P) {
      // TODO: uncomment P2P partial implementation once it's available for Etherspot
      // return this.sendP2PTransaction(transaction);
    }

    const etherspotTransactions = await mapToEthereumTransactions(transaction, fromAccountAddress);
    console.log("etherspotTransactions")
    return this.setTransactionsBatchAndSend(etherspotTransactions, chain);
  }

  async sendENSTransaction(
    chain: Chain,
  ): Promise<TransactionResult> {
    const sdk = this.getSdkForChain(chain);
    if (!sdk) {
      reportErrorLog('setTransactionsBatchAndSend failed: no SDK for chain set', { chain });
      throw new Error('error.unableToSendTransaction');
    }

    // submit current batch
    const { hash: batchHash } = await sdk.submitGatewayBatch();

    return { batchHash };
  }

  getSubmittedBatchByHash(chain: Chain, hash: string): Promise<GatewaySubmittedBatch> {
    const sdk = this.getSdkForChain(chain);
    if (!sdk) {
      reportErrorLog('getSubmittedBatchByHash failed: no SDK for chain set', { chain });
      return null;
    }

    return sdk.getGatewaySubmittedBatch({ hash }).catch((error) => {
      reportErrorLog('getSubmittedBatchByHash failed', { hash, error });
      return null;
    });
  }

  async getTransactionExplorerLinkByBatch(chain: Chain, batchHash: string): Promise<string> {
    const submittedBatch = await this.getSubmittedBatchByHash(chain, batchHash);

    const transactionHash = submittedBatch?.transaction?.hash;
    if (!transactionHash) return null;

    return this.getTransactionExplorerLink(chain, transactionHash);
  }

  getTransactionExplorerLink(chain: Chain, transactionHash: string): string {
    let blockchainExplorerUrl;

    switch (chain) {
      case CHAIN.POLYGON:
        blockchainExplorerUrl = getEnv().TX_DETAILS_URL_POLYGON;
        break;
      case CHAIN.XDAI:
        blockchainExplorerUrl = getEnv().TX_DETAILS_URL_XDAI;
        break;
      case CHAIN.BINANCE:
        blockchainExplorerUrl = getEnv().TX_DETAILS_URL_BINANCE;
        break;
      case CHAIN.AVALANCHE:
        blockchainExplorerUrl = getEnv().TX_DETAILS_URL_AVALANCHE;
        break;
      default:
        blockchainExplorerUrl = getEnv().TX_DETAILS_URL_ETHEREUM;
        break;
    }

    return `${blockchainExplorerUrl}${transactionHash}`;
  }

  waitForTransactionHashFromSubmittedBatch(chain: Chain, batchHash: string): Promise<void|string> {
    const sdk = this.getSdkForChain(chain);
    if (!sdk) {
      reportErrorLog(
        'EtherspotService waitForTransactionHashFromSubmittedBatch failed: no sdk instance for network name',
        { chain },
      );
      // fail gracefully as transaction has been sent anyway
      return Promise.resolve();
    }

    let temporaryBatchSubscription;

    return new Promise((resolve, reject) => {
      temporaryBatchSubscription = sdk.notifications$
        .pipe(
          map(async (notification) => {
            if (notification.type === NotificationTypes.GatewayBatchUpdated) {
              const submittedBatch = await sdk.getGatewaySubmittedBatch({ hash: batchHash });

              const failedStates = [
                GatewayTransactionStates.Canceling,
                GatewayTransactionStates.Canceled,
                GatewayTransactionStates.Reverted,
              ];

              let finishSubscription;
              if (submittedBatch?.transaction?.state && failedStates.includes(submittedBatch?.transaction?.state)) {
                finishSubscription = () => reject(submittedBatch.transaction.state);
              } else if (submittedBatch?.transaction?.hash) {
                finishSubscription = () => resolve(submittedBatch.transaction.hash);
              }

              if (finishSubscription) {
                if (temporaryBatchSubscription) temporaryBatchSubscription.unsubscribe();
                finishSubscription();
              }
            }
          }),
        )
        .subscribe();
    });
  }

  async getTransactionsByAddress(chain: Chain, address: string): Promise<EtherspotTransaction[]> {
    const sdk = this.getSdkForChain(chain);
    if (!sdk) {
      reportErrorLog('getSupportedAssetsByChain failed: no sdk instance for chain', { chain });
      return null;
    }

    return sdk
      .getTransactions({ account: sdk.state.accountAddress })
      .then(({ items }) => items)
      .catch((error) => {
        reportErrorLog('getTransactionsByAddress -> getTransactions failed', { address, chain, error });
        return null;
      });
  }

  async getAccountTotalBalances(
    accountAddress: string,
    currencySymbol: EtherspotCurrencies,
  ): Promise<EtherspotAccountTotalBalancesItem[]> {
    try {
      const { totalBalances } = await this.sdk.getAccountTotalBalances({
        account: accountAddress,
        currency: currencySymbol,
      });

      return totalBalances;
    } catch (error) {
      reportErrorLog('EtherspotService getAccountTotalBalances failed', {
        error,
        accountAddress,
        currencySymbol,
      });
      return null;
    }
  }

  async getSupportedAssets(chain: Chain): Promise<Asset[]> {
    const sdk = this.getSdkForChain(chain);
    if (!sdk) {
      reportErrorLog('getSupportedAssetsByChain failed: no sdk instance for chain', { chain });
      return null;
    }

    try {
      const tokenListName = getChainTokenListName(chain);

      let tokens: TokenListToken[] = await sdk.getTokenListTokens({ name: tokenListName });

      if (!tokens) {
        reportErrorLog('EtherspotService getSupportedAssets failed: no tokens returned', { tokenListName });
        tokens = []; // let append native assets
      }

      let supportedAssets = tokens.map((token) => parseTokenListToken(token));

      supportedAssets = appendNativeAssetIfNeeded(chain, supportedAssets);

      // rest of checks are Ethereum mainnet (prod) only
      if (chain !== CHAIN.ETHEREUM || !isProdEnv()) return supportedAssets;

      // add LP tokens from our own list, later this can be replaced with Etherspot list for LP tokens
      LIQUIDITY_POOLS().forEach(({ uniswapPairAddress: address, name, symbol, iconUrl }) => {
        const existingAsset = findAssetByAddress(supportedAssets, address);
        if (!existingAsset) {
          supportedAssets.push({
            chain,
            address,
            name,
            symbol,
            // eslint-disable-next-line max-len
            decimals: 18, // ref https://raw.githubusercontent.com/jab416171/uniswap-pairtokens/master/uniswap_pair_tokens.json
            iconUrl,
          });
        }
      });

      return supportedAssets;
    } catch (error) {
      reportErrorLog('EtherspotService getSupportedAssets failed', { error });
      return null;
    }
  }

  async logout(): Promise<void> {
    if (!this.sdk) return; // not initialized, nothing to do

    await this.sdk.destroy();
    this.sdk = null;
  }

  async getExchangeOffers(
    chain: Chain,
    fromAsset: AssetCore,
    toAsset: AssetCore,
    fromAmount: BigNumber,
  ): Promise<ExchangeOffer[]> {
    const sdk = this.getSdkForChain(chain);
    if (!sdk || !fromAsset || !toAsset) return [];

    const captureFee = getCaptureFee(fromAmount); // can be 0
    const fromAmountAfterCaptureFee = fromAmount.sub(captureFee);
    const fromAmountEthers = EthersUtils.parseUnits(fromAmountAfterCaptureFee.toString(), fromAsset.decimals);

    try {
      const offers: EtherspotExchangeOffer[] = await sdk.getExchangeOffers({
        fromTokenAddress: fromAsset.address,
        toTokenAddress: toAsset.address,
        fromAmount: fromAmountEthers,
      });

      return offers.map((offer) => buildExchangeOffer(chain, fromAsset, toAsset, fromAmount, offer, captureFee));
    } catch (error) {
      reportErrorLog('EtherspotService getExchangeOffers failed', { chain, error });
      return [];
    }
  }

  async getGasPrice(chain: Chain): Promise<GasPrice> {
    const sdk = this.getSdkForChain(chain);
    if (!sdk) return null;

    try {
      const { standard, fast, instant } = await sdk.getGatewayGasInfo();

      // maps from ethers.js BigNumber
      return {
        standard:  BigNumber.from(standard.toString()),
        fast:  BigNumber.from(fast.toString()),
        instant:  BigNumber.from(instant.toString()),
      };
    } catch (error) {
      reportErrorLog('EtherspotService getGasPrice failed', { chain, error });
      return null;
    }
  }

  getContract<T>(chain: Chain, abi: Object[], address: string): any {
    const sdk = this.getSdkForChain(chain);
    if (!sdk) return null;

    try {
      // contract name is for internal use, just to not pollute let's create contracts under chain-address
      return sdk.registerContract(`${chain}-${address}`, abi, address);
    } catch (error) {
      reportErrorLog('EtherspotService getExchangeOffers failed', { chain, error });
      return null;
    }
  }

  async getNftList(chain: Chain, address: string): Promise<NftList | null> {
    const sdk = this.getSdkForChain(chain);

    if (!sdk) {
      reportErrorLog('EtherspotService getNftList getSdk failed', { chain });
      return null;
    }

    return sdk
      .getNftList({
        account: address,
      })
      .catch((error) => {
        reportErrorLog('EtherspotService getNftList failed', { chain, address, error });
        return null;
      });
  }

  async getTransaction(chain: Chain, hash: string): Promise<EtherspotTransaction> {
    const sdk = this.getSdkForChain(chain);
    if (!sdk) return null;

    try {
      return sdk.getTransaction({ hash });
    } catch (error) {
      reportErrorLog('EtherspotService getTransaction failed', { chain, hash, error });
      return null;
    }
  }
}

const etherspot = new EtherspotService();

// this is for accounts unrelated Etherspot SDK usage
const etherspotSupportService = new EtherspotService();

export const getEtherspotSupportService = async (): Promise<EtherspotService> => {
  if (etherspotSupportService.sdk) return etherspotSupportService;

  const wallet = EthersWallet.createRandom();
  await etherspotSupportService.init(wallet.privateKey);

  return etherspotSupportService;
};

export default etherspot;

function networkNameFromChain(chain: Chain): string {
  switch (chain) {
    case CHAIN.ETHEREUM:
      return isProdEnv() ? NetworkNames.Mainnet : NetworkNames.Kovan;
    case CHAIN.BINANCE:
      return NetworkNames.Bsc;
    case CHAIN.POLYGON:
      return NetworkNames.Matic;
    case CHAIN.XDAI:
      return NetworkNames.Xdai;
    case CHAIN.AVALANCHE:
      return isProdEnv() ? NetworkNames.Avalanche : NetworkNames.Fuji;
    default:
      return null;
  }
}

function chainFromNetworkName(networkName: string): Chain {
  switch (networkName) {
    case NetworkNames.Mainnet:
    case NetworkNames.Kovan:
      return CHAIN.ETHEREUM;
    case NetworkNames.Bsc:
      return CHAIN.BINANCE;
    case NetworkNames.Matic:
      return CHAIN.POLYGON;
    case NetworkNames.Xdai:
      return CHAIN.XDAI;
    case NetworkNames.Avalanche:
    case NetworkNames.Fuji:
      return CHAIN.AVALANCHE;
    default:
      return null;
  }
}
