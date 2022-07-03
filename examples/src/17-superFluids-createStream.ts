import { utils } from "ethers";
import { NetworkNames, Sdk, EnvNames } from "../../src";
import { logger } from "./common";

async function main(): Promise<void> {

    const SENDER_PRIVATE_KEY = "";
    const receiverAddress = "";
    const superTokenAddress = ""; //SuperToken Address in the desired chain

    try {

        const sdk = new Sdk(
            SENDER_PRIVATE_KEY,
            { networkName: NetworkNames.Fuji, env: EnvNames.TestNets },
        ); // sender wallet sdk instance

        await sdk.computeContractAccount();

        const txnData = await sdk.createStreamTransactionPayload({
            tokenAddress: superTokenAddress,
            receiver: receiverAddress,
            amount: utils.parseEther('0.1')
        })
        if (!txnData.error && txnData.data && txnData.to) {
            // Submit the Transaction data using Etherspot SDK
            await sdk.clearGatewayBatch();
            await sdk.batchExecuteAccountTransaction({
                to: txnData.to,
                data: txnData.data,
            });
            logger.log('estimated batch', await sdk.estimateGatewayBatch());
            logger.log('submitted batch', await sdk.submitGatewayBatch());
        } else {
            logger.log('Error:', txnData.error);
        }
    } catch (Err){
        logger.log("Caught Error: ", Err);
    }
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
