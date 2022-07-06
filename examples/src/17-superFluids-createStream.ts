import { BigNumber } from "ethers";
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

        /*
        * Make sure that the amount is not too low for the estimate to fail.
        * If Estimation fails, you will receive all parameters as null
        */
        const txnData = await sdk.createStreamTransactionPayload({
            tokenAddress: superTokenAddress,
            receiver: receiverAddress,
            amount: BigNumber.from("1000000000000"), // amount in wei
        })

        logger.log('Transaction Data: ', txnData);
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
