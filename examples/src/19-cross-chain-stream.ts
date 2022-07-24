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

async function main(): Promise<void> {
  const SENDER_PRIVATE_KEY = process.env.SENDER_PRIVATE_KEY;
  const INFURA_PROJECT_ID = process.env.PROJECT_ID;

  try {
    // TEST ERC20 Token (Goerli)
    const fromToken = "0x26FE8a8f86511d678d031a022E48FfF41c6a3e3b";
    // TEST ERC20 Token (Rinkeby)
    const toToken = "0x3FFc03F05D1869f493c7dbf913E636C6280e0ff9";
    const receiver = "0xaA2e72E4f8a98626B5D41a9CF5dfd237fC1F70e4";

    const goerliProvider = new ethers.providers.InfuraProvider("goerli", INFURA_PROJECT_ID);
    const rinkebyProvider = new ethers.providers.InfuraProvider("rinkeby", INFURA_PROJECT_ID);
    const goerliWallet = new Wallet(SENDER_PRIVATE_KEY, goerliProvider);
    const rinkeyWallet = new Wallet(SENDER_PRIVATE_KEY, rinkebyProvider);
    const crossChainStreamingService = new CrossChainStreamService(
      NetworkNames.Goerli,
      NetworkNames.Rinkeby,
      fromToken,
      toToken,
      ethers.utils.parseEther("10"),
      receiver
    );
    await crossChainStreamingService.init(
      goerliWallet,
      { networkName: NetworkNames.Goerli, env: EnvNames.TestNets },
      rinkeyWallet,
      { networkName: NetworkNames.Rinkeby, env: EnvNames.TestNets },
    );
    await crossChainStreamingService.prepare();

    // -- wait some time while connext is sending funds to destination chain
    // -- usually it takes 3-5 minutes in testnets
    // await crossChainStreamingService.createStream();
  } catch (err) {
    logger.log("Caught Error: ", err);
  }
}

main()
  .catch(logger.error)
  .finally(() => process.exit());

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
    private disableSwap?: boolean,
  ) {
    this.canonicalFromToken = fromToken;
    this.canonicalToToken = toToken;
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
    const supportedChains = await sdk.getCrossChainBridgeSupportedChains({
      serviceProvider: CrossChainServiceProvider.Connext
    });
    if (!supportedChains.find(
      ({ chainId }) => chainId === this.chainIds.from
    )
    ) {
      throw new Error("Origin chain not supported by bridge");
    }
    if (!supportedChains.find(
      ({ chainId }) => chainId === this.chainIds.to)
    ) {
      throw new Error("Destination chain not supported by bridge");
    }
  }

  /**
   * Sends funds to the destination chain
   * If the asset on the origin chain is not supported
   * by Connext, then it swaps to canonical asset via available dex
   * @returns batch transaction receipt
   */
  async prepare(): Promise<ethers.providers.TransactionReceipt> {
    const sdk = this.sdkIntances[this.fromChain];
    const supportedTokens = await this.fetchSupportedTokens();
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
    this.amountToTransfer = this.amount;
    if (!supportsFromToken) {
      const token = supportedTokens.find(token =>
        token.chainId === this.chainIds.from
      );
      if (!token) {
        throw new Error("Canonical token not set");
      }
      this.canonicalFromToken = token.address;
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
      serviceProvider: CrossChainServiceProvider.Connext,
    });
    const erc20 = this.getERC20Contract(
      this.fromChain,
      this.canonicalFromToken
    );
    const sendTx = await this.fromWallet.sendTransaction(
      erc20.encodeTransfer(
        sdk.state.accountAddress,
        this.amountToTransfer
      )
    );
    await sendTx.wait()
    const approvalRequest = erc20.encodeApprove(
      quote.approvalData.approvalAddress,
      quote.approvalData.amount
    );
    await sdk.batchExecuteAccountTransaction(approvalRequest);
    await sdk.batchExecuteAccountTransaction(quote.transaction);
    const batch = await sdk.encodeGatewayBatch();
    const response = await this.fromWallet.sendTransaction(batch);
    return await response.wait();
  }

  /**
   * Wraps token to a super token and starts streaming
   * If the asset was swapped to a canonical by prepare()
   * it is swapped back to the original asset via available dex
   * @returns submitted batch transaction hash
   */
  async createStream(): Promise<ethers.providers.TransactionReceipt> {
    const sdk = this.sdkIntances[this.toChain];
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
        this.amountToTransfer.mul(0.995)
      );
    }
    const erc20TokenContract = this.getERC20Contract(
      this.toChain,
      this.toToken
    );
    if (!this.superTokenAddress) {
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
    }
    await sdk.clearGatewayBatch();
    const superTokenContract = new SuperTokenContract(
      this.superTokenAddress
    );
    const approveReq = erc20TokenContract.encodeApprove(
      this.superTokenAddress,
      this.amountToStream
    );
    sdk.batchExecuteAccountTransaction(approveReq)
    const upgradeReq = superTokenContract.encodeUpgrade(
      this.amountToStream
    );
    sdk.batchExecuteAccountTransaction(upgradeReq);
    const txnData = await sdk.createStreamTransactionPayload({
      tokenAddress: this.superTokenAddress,
      receiver: this.receiver,
      amount: this.amountToStream, // amount in wei
    });
    await sdk.batchExecuteAccountTransaction(txnData);
    const batch = await sdk.encodeGatewayBatch();
    const response = await this.toWallet.sendTransaction(batch);
    return await response.wait();
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
      serviceProvider: CrossChainServiceProvider.Connext,
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
