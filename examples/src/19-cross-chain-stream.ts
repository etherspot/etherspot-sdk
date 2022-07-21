import { ContractNames, getContractAbi } from "@etherspot/contracts";
import { BigNumber, ethers } from "ethers";
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
  GatewaySubmittedBatch,
  CrossChainBridgeToken,
  SuperTokenContract
} from "../../src";
import { logger } from "./common";

class CrossChainStreamService {
  sdkIntances: { [network: string]: Sdk } = {};
  private initialized: boolean = false;
  // canonical is a default token of a chain chosen by connext
  private canonicalToToken: string;
  private canonicalFromToken: string;
  // amount to transfer to another chain
  private amountToTransfer: BigNumber;
  // amount to stream (may be less after swaps and exchanges)
  private amountToStream: BigNumber;
  // super token wrapper
  private superTokenAddress: string;

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
   * @param privateKey private key
   * @param options network options
   */
  async init(privateKey: string, options: SdkOptions[]) {
    for (let option of options) {
      const { networkName } = option;
      this.sdkIntances[networkName] = new Sdk(privateKey, option);
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
    this.initialized = true;
  }

  /**
   * Sends funds to the destination chain
   * If the asset on the origin chain is not supported
   * by Connext, then it swaps to canonical asset via available dex
   * @returns submitted batch transaction hash
   */
  async prepare(): Promise<GatewaySubmittedBatch> {
    if (!this.initialized) {
      throw new Error("Not inititalized");
    }
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
      serviceProvider: CrossChainServiceProvider.Connext
    });
    const erc20 = this.getERC20Contract(
      this.fromChain,
      this.canonicalFromToken
    )
    const approvalRequest = erc20.encodeApprove(
      quote.approvalData.approvalAddress,
      quote.approvalData.amount
    );
    await sdk.batchExecuteAccountTransaction(approvalRequest);
    await sdk.estimateGatewayBatch();
    return await sdk.submitGatewayBatch();
  }

  /**
   * Wraps token to a super token and starts streaming
   * If the asset was swapped to a canonical by prepare()
   * it is swapped back to the original asset via available dex
   * @returns submitted batch transaction hash
   */
  async createStream(): Promise<GatewaySubmittedBatch> {
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
      this.superTokenAddress = await sdk.createSuperERC20Wrapper(
        this.toToken
      );
    }
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
    await sdk.estimateGatewayBatch();
    return await sdk.submitGatewayBatch();
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
    const sdk = this.sdkIntances[this.chainIds.from];
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

async function main(): Promise<void> {
  const SENDER_PRIVATE_KEY = "0x8e434e06c0af485f9fc217b03bcfee8a8d6db1cebc0640d707e831c4910b81b6";
  try {
    const fromToken = "0x26FE8a8f86511d678d031a022E48FfF41c6a3e3b";
    const toToken = "0x3FFc03F05D1869f493c7dbf913E636C6280e0ff9";
    const receiver = "0x7220A66Ed094F0C7c04e221ff5b436bD304776A0";

    const crossChainStreamingService = new CrossChainStreamService(
      NetworkNames.Goerli,
      NetworkNames.Rinkeby,
      fromToken,
      toToken,
      ethers.utils.parseEther("100"),
      receiver
    );
    await crossChainStreamingService.init(
      SENDER_PRIVATE_KEY,
      [
        { networkName: NetworkNames.Rinkeby, env: EnvNames.TestNets },
        { networkName: NetworkNames.Goerli, env: EnvNames.TestNets },
      ],
    );
    await crossChainStreamingService.prepare();
    // wait some time while connext is sending funds to destination chain
    await crossChainStreamingService.createStream();
  } catch (err) {
    logger.log("Caught Error: ", JSON.stringify(err, undefined, 2));
  }
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
