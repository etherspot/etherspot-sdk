import { ContractNames, getContractAbi } from "@etherspot/contracts";
import { BigNumber, ethers, Wallet } from "ethers";
import {
  NetworkNames,
  Sdk,
  EnvNames,
  SdkOptions,
  CrossChainServiceProvider,
  NETWORK_NAME_TO_CHAIN_ID,
  SocketTokenDirection,
  addressesEqual,
  ExchangeOffer,
  ERC20TokenContract,
  CrossChainBridgeToken,
  SuperTokenContract,
  SuperTokenFactoryContract,
} from "../../src";
import { logger } from "./common";

class CrossChainStreamService {
  sdkIntances: { [network: string]: Sdk } = {};
  // canonical is a default token of a chain chosen by connext
  private canonicalToToken: string;
  private canonicalFromToken: string;
  // amount to transfer to another chain
  private amountToTransfer: BigNumber;
  // amount to stream (may be less after swaps and exchanges)
  private amountToStream: BigNumber;
  // super token wrapper
  private superTokenAddress: string;
  private fromWallet: Wallet;
  private toWallet: Wallet;

  constructor(
    private fromChain: NetworkNames,
    private toChain: NetworkNames,
    private fromToken: string,
    private toToken: string,
    private amount: BigNumber,
    private receiver: string,
    private flowRate: BigNumber,
    private serviceProvider: 
      CrossChainServiceProvider = CrossChainServiceProvider.Connext,
    private disableSwap?: boolean,
  ) {
    this.canonicalFromToken = fromToken;
    this.canonicalToToken = toToken;
    // all three are subject to change after swapping/exchanging
    this.amountToStream = this.amountToTransfer = this.amount;
  }

  /**
   * initializes sdk instances and checks if selected
   * networks are supported by Connext
   * @param fromWallet wallet on origin chain
   * @param fromNetwork origin chain options
   * @param toWallet wallet on destination chain
   * @param toNetwork destination chain options
   */
  async init(
    fromWallet: Wallet,
    fromNetwork: SdkOptions,
    toWallet: Wallet,
    toNetwork: SdkOptions
  ) {
    console.log("Initializing...");
    this.fromWallet = fromWallet;
    this.toWallet = toWallet;
    {
      const { networkName } = fromNetwork;
      this.sdkIntances[networkName] = new Sdk(fromWallet, fromNetwork);
      await this.sdkIntances[networkName].computeContractAccount();
    }
    {
      const { networkName } = toNetwork;
      this.sdkIntances[networkName] = new Sdk(toWallet, toNetwork);
      await this.sdkIntances[networkName].computeContractAccount();
    }
    const sdk = this.sdkIntances[this.fromChain];
    console.log("Checking supported chains...");
    const supportedChains = await sdk.getCrossChainBridgeSupportedChains({
      serviceProvider: this.serviceProvider
    });
    if (!supportedChains.find(
      ({ chainId }) => chainId === this.chainIds.from)
    ) {
      console.log("Origin chain is not supported by bridge");
      throw new Error("Chain not supported");
    }
    if (!supportedChains.find(
      ({ chainId }) => chainId === this.chainIds.to)
    ) {
      console.log("Destination chain is not supported by bridge");
      throw new Error("Chain not supported");
    }
    console.log("Crosschain streaming service initialized");
  }

  /**
   * Sends funds to the destination chain
   * If the asset on the origin chain is not supported
   * by Connext, then it swaps to canonical asset via available dex
   * @returns batch transaction receipt
   */
  async prepare(): Promise<ethers.providers.TransactionReceipt> {
    console.log("Preparing: Fetching supported tokens...");
    const sdk = this.sdkIntances[this.fromChain];
    const supportedTokens = await this.fetchSupportedTokens();
    console.log(this.chainIds.from, supportedTokens.find(
      token => addressesEqual(token.address, this.fromToken) &&
        token.chainId === this.chainIds.from));
    const supportsFromToken = supportedTokens.find(
      token => addressesEqual(token.address, this.fromToken) &&
        token.chainId === this.chainIds.from);
    const supportsToToken = supportedTokens.find(
      token => addressesEqual(token.address, this.toToken) &&
        token.chainId === this.chainIds.to);
    if (this.disableSwap) {
      if (!supportsFromToken) {
        throw new Error("Origin token not supported by bridge");
      }
      if (!supportsToToken) {
        throw new Error("Destination token not supported by bridge");
      }
    }
    if (!supportsFromToken) {
      const token = supportedTokens.find(token =>
        token.chainId === this.chainIds.from
      );
      if (!token) {
        throw new Error("Canonical token not set");
      }
      this.canonicalFromToken = token.address;
      logger.log("Swapping tokens...", {
        from: this.fromToken,
        to: this.canonicalFromToken,
      });
      this.amountToTransfer = await this.swapToken(
        this.fromChain,
        this.fromToken,
        this.canonicalFromToken,
        this.amount
      );
    }
    const { items: [quote] } = await sdk.getCrossChainQuotes({
      fromTokenAddress: this.canonicalFromToken,
      toTokenAddress: this.toToken,
      fromChainId: this.chainIds.from,
      toChainId: this.chainIds.to,
      fromAmount: this.amountToTransfer,
      serviceProvider: this.serviceProvider,
    });
    logger.log("Got crosschain quote:", { quote });
    const erc20 = this.getERC20Contract(
      this.fromChain,
      this.canonicalFromToken
    );

    console.log("Sending tokens to account...");
    if (!addressesEqual(
      this.canonicalFromToken,
      ethers.constants.AddressZero)
    ) {
      const sendTx = await this.fromWallet.sendTransaction(
        erc20.encodeTransfer(
          sdk.state.accountAddress,
          this.amountToTransfer
        )
      );
      await sendTx.wait();
      console.log('Sent');
    } else {
      const sendTx = await this.fromWallet.sendTransaction({
        to: sdk.state.account.address,
        value: this.amountToTransfer
      });
      await sendTx.wait();
      console.log('Sent');
    }
    if (quote.approvalData) {
      const approvalRequest = erc20.encodeApprove(
        quote.approvalData.approvalAddress,
        quote.approvalData.amount
      );
      await sdk.batchExecuteAccountTransaction(approvalRequest);
    } else {
      console.log('No need for approval. Sending native asset?');
    }
    await sdk.batchExecuteAccountTransaction(quote.transaction);
    const batch = await sdk.encodeGatewayBatch();
    console.log("Sending tokens to another chain...");
    const response = await this.fromWallet.sendTransaction(batch);
    console.log("Sent. Wait until you receive funds and start streaming");
    return await response.wait();
  }

  /**
   * Wraps token to a super token and starts streaming
   * If the asset was swapped to a canonical by prepare()
   * it is swapped back to the original asset via available dex
   * @returns submitted batch transaction hash
   */
  async createStream(): Promise<ethers.providers.TransactionReceipt> {
    console.log("Creating stream...");
    const sdk = this.sdkIntances[this.toChain];
    console.log("Fething supported tokens...");
    const supportedTokens = await this.fetchSupportedTokens();
    const supportsToToken = supportedTokens.find(
      token => addressesEqual(token.address, this.toToken) &&
        token.chainId === this.chainIds.to);
    if (!supportsToToken) {
      const token = supportedTokens.find(token =>
        token.chainId === this.chainIds.to
      );
      if (!token) {
        throw new Error("Canonical token not set");
      }
      this.canonicalToToken = token.address;
    }
    if (!addressesEqual(this.canonicalToToken, this.toToken)) {
      this.amountToStream = await this.swapToken(
        this.toChain,
        this.canonicalToToken,
        this.toToken,
        this.amountToTransfer.mul(
          this.serviceProvider === CrossChainServiceProvider.Connext ? 0.995 : 1
        )
      );
    }
    const erc20TokenContract = this.getERC20Contract(
      this.toChain,
      this.toToken
    );
    if (!this.superTokenAddress) {
      logger.log("Creating super token wrapper...", {
        underlyingToken: this.toToken
      });
      const tx = await sdk.createSuperERC20WrapperTransactionPayload(
        this.toToken
      );
      await sdk.batchExecuteAccountTransaction(tx);
      const txResponse = await this.toWallet.sendTransaction(
        await sdk.encodeGatewayBatch()
      );
      const txReceipt = await txResponse.wait();
      const factoryContract = new SuperTokenFactoryContract();
      const factoryCreated = factoryContract
        .parseLogs(txReceipt.logs)
        .find(log => log && log.event === 'SuperTokenCreated');
      if (!factoryCreated) {
        return null;
      }
      this.superTokenAddress = factoryCreated.args[0];
      logger.log("Created super token wrapper", { address: this.superTokenAddress });
    }
    await sdk.clearGatewayBatch();
    const superTokenContract = new SuperTokenContract(
      this.superTokenAddress
    );
    console.log("Approving for upgrade...")
    const approveReq = erc20TokenContract.encodeApprove(
      this.superTokenAddress,
      this.amountToStream
    );
    await sdk.batchExecuteAccountTransaction(approveReq)
    console.log("Upgrading to super token...")
    const upgradeReq = superTokenContract.encodeUpgrade(
      this.amountToStream
    );
    await sdk.batchExecuteAccountTransaction(upgradeReq);
    // {
    //   const batch = await sdk.encodeGatewayBatch();
    //   console.log("Sending batch transaction");
    //   const response = await this.toWallet.sendTransaction(batch);
    //   console.log("Batch transaction sent");
    //   await response.wait();
    // }
    console.log("Starting stream...")
    const txnData = await sdk.createStreamTransactionPayload({
      tokenAddress: this.superTokenAddress,
      receiver: this.receiver,
      amount: this.flowRate, // amount in wei
      skipBalanceCheck: true,
    });
    await sdk.batchExecuteAccountTransaction(txnData);
    {
      const batch = await sdk.encodeGatewayBatch();
      console.log("Sending batch transaction");
      const response = await this.toWallet.sendTransaction(batch);
      console.log("Batch transaction sent");
      return await response.wait();
    }
  }

  async swapToken(
    chain: NetworkNames,
    from: string,
    to: string,
    amount: BigNumber
  ): Promise<BigNumber> {
    const sdk = this.sdkIntances[chain];
    const offer = await this.getTokenSwapOffer(
      chain,
      from,
      to,
      amount
    );
    if (!offer) {
      throw new Error("Cannot exchange");
    }
    const erc20Contract = this.getERC20Contract(chain, from);
    const approvalRequest = erc20Contract.encodeApprove(
      offer.transactions[0].to,
      amount
    );
    await sdk.batchExecuteAccountTransaction(approvalRequest);
    return offer.receiveAmount;
  }

  async getTokenSwapOffer(
    chain: NetworkNames,
    from: string,
    to: string,
    amount: BigNumber
  ): Promise<ExchangeOffer> {
    const sdk = this.sdkIntances[chain];
    const offers = await sdk.getExchangeOffers({
      fromTokenAddress: from,
      toTokenAddress: to,
      fromAmount: BigNumber.from(amount),
    });
    // find best offer
    const offer = offers.reduce((p, c) => {
      if (
        p.receiveAmount.lt(c.receiveAmount) &&
        c.transactions.length > 0
      ) {
        p = c;
      }
      return p;
    });
    return offer;
  }

  private async fetchSupportedTokens(): Promise<CrossChainBridgeToken[]> {
    const sdk = this.sdkIntances[this.fromChain];
    return await sdk.getCrossChainBridgeTokenList({
      fromChainId: this.chainIds.from,
      toChainId: this.chainIds.to,
      direction: SocketTokenDirection.From,
      serviceProvider: this.serviceProvider,
    });
  }

  private getERC20Contract(chainId: NetworkNames, address: string) {
    const sdk = this.sdkIntances[chainId];
    return sdk.registerContract<ERC20TokenContract>(
      'erc20Contract',
      getContractAbi(ContractNames.ERC20Token),
      address
    );
  }

  private get chainIds() {
    return {
      from: NETWORK_NAME_TO_CHAIN_ID[this.fromChain],
      to: NETWORK_NAME_TO_CHAIN_ID[this.toChain],
    }
  }
}

async function main(): Promise<void> {
  const SENDER_PRIVATE_KEY = '';
  const GOERLI_ALCHEMY_KEY = '';
  const MUMBAI_ALCHEMY_KEY = '';

  try {
    // TEST ERC20 Token (Goerli)
    const fromToken = "0x0000000000000000000000000000000000000000";
    // TEST ERC20 Token (Mumbai)
    const toToken = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";
    const receiver = "0xaA2e72E4f8a98626B5D41a9CF5dfd237fC1F70e4";

    const fromProvider = new ethers.providers.InfuraProvider(5, GOERLI_ALCHEMY_KEY);
    const toProvider = new ethers.providers.AlchemyProvider(80001, MUMBAI_ALCHEMY_KEY);
    const fromWallet = new Wallet(SENDER_PRIVATE_KEY, fromProvider);
    const toWallet = new Wallet(SENDER_PRIVATE_KEY, toProvider);
    const crossChainStreamingService = new CrossChainStreamService(
      NetworkNames.Goerli,
      NetworkNames.Mumbai,
      fromToken,
      toToken,
      ethers.utils.parseEther("0.001"),
      receiver,
      ethers.BigNumber.from("1000"),
      CrossChainServiceProvider.LiFi,
      true
    );
    await crossChainStreamingService.init(
      fromWallet,
      { networkName: NetworkNames.Goerli, env: EnvNames.TestNets },
      toWallet,
      { networkName: NetworkNames.Mumbai, env: EnvNames.TestNets },
    );
    await crossChainStreamingService.prepare();

    // -- wait some time while connext is sending funds to destination chain
    // -- usually it takes 3-5 minutes in testnets
    // await crossChainStreamingService.createStream();
  } catch (err) {
    console.error("Caught Error: ", JSON.stringify(err, undefined, 2));
  }
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
