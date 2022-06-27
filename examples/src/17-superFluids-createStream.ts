import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { NetworkNames, Sdk, EnvNames } from "../../src";
import { logger } from "./common";

async function main(): Promise<void> {

    const SENDER_PRIVATE_KEY = "";
    const receiverAddress = "";
    const superTokenAddress = ""; //SuperToken Address in the desired chain

    try {

        const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
        const sdk = new Sdk(
            SENDER_PRIVATE_KEY,
            { networkName: NetworkNames.Fuji, env: EnvNames.TestNets },
        ); // sender wallet sdk instance

        await sdk.computeContractAccount(); 
        const senderAddress = sdk.state.accountAddress;

        /*
        ** Initialise SuperFluid SDK with chainid and provider
        ** Make sure that the chainid is supported by SuperFluid
        ** You can verify the supported networks available in https://docs.superfluid.finance/superfluid/developers/networks
        */
        const sf = await Framework.create({
            chainId: 43113,
            provider
        });

        // Get balance of Supertoken before streaming
        const balance = await sf.query.listUserInteractedSuperTokens({account: sdk.state.accountAddress, token: superTokenAddress});
        logger.log("balance: ", balance);

        // Get Stream info
        const flowInfo = await sf.cfaV1.getFlow({
            sender: senderAddress,
            receiver: receiverAddress,
            superToken: superTokenAddress,
            providerOrSigner: provider
        });
        logger.log("flowInfo", flowInfo);

        // Check if there are any existing stream present from sender to receiver on the desired superToken 
        if(flowInfo && flowInfo.flowRate === '0') {
            // Create Stream using SuperFluid SDK
            const createFlowOperation = sf.cfaV1.createFlow({
                sender: senderAddress,
                receiver: receiverAddress,
                superToken: superTokenAddress,
                flowRate: "100000000000" // Amount of tokens streamed per month(in wei)
            });
            
            // Get Transaction data using SuperFluid SDK
            const txnData = await createFlowOperation.getPopulatedTransactionRequest(provider.getSigner(sdk.state.accountAddress));

            // Submit the Transaction data using Etherspot SDK
            await sdk.clearGatewayBatch();
            await sdk.batchExecuteAccountTransaction({
                to: txnData.to,
                data: txnData.data,
            });
            logger.log('estimated batch', await sdk.estimateGatewayBatch());
            logger.log('submitted batch', await sdk.submitGatewayBatch());
        } else {
            logger.log("Cannot create stream as the stream is already active", null);
        }


    } catch (Err){
        logger.log("Caught Error: ", Err);
    }
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
