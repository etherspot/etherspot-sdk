import { NetworkNames, Sdk, EnvNames } from "./src";
// import { Framework } from "@superfluid-finance/sdk-core";
// import { ethers, BigNumber } from "ethers";


async function main() {
    try {
        // let provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/502a8e83d34d471596ca857eec9771ff')
        // const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
        const sdk = new Sdk(
        // "0x513a984bbd054d9fb6d8ba656183185f55bad24a8f900a57a820077374fa9779",
            "0x9648a8add89fd006b4d5a8f913b6547ffab680fa3b0bcd91247cc23092e47fd0",
            { networkName: NetworkNames.Mumbai, env: EnvNames.TestNets },
        ); // current sdk instance
        await sdk.computeContractAccount();
        console.log(await sdk.getAccountBalances({
          account: sdk.state.accountAddress,
          tokens: [],
        }))
        // const sf = await Framework.create({
        // chainId: 80001,
        // provider
        // });
        // const balance = await sf.query.listUserInteractedSuperTokens({account: "0x80a1874E1046B1cc5deFdf4D3153838B72fF94Ac", "token": "0x96b82b65acf7072efeb00502f45757f254c2a0d4".toLowerCase()});
    
        // console.log(balance.items[0].token);
        // const balances = await sf.query.listUserInteractedSuperTokens({account: sdk.state.accountAddress});
        // console.log(sf.query.listStreams({account: sdk.state.accountAddress}));
        // console.log(balances);
        // const balance = balances.items?.map(
        //     ({ balanceUntilUpdatedAt, token }) => {
        //         new AccountBalance({
        //             token,

        //         })
        //     }
        // )
        // console.log(balance.length);
    } catch (Err){
        console.log(Err);
    }

}

main();