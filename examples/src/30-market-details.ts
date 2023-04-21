import { EnvNames, NetworkNames, Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
    const PRIVATE_KEY = ''; //Privite key Example: get from metamask

    const sdk = new Sdk(PRIVATE_KEY, { env: EnvNames.LocalNets, networkName: NetworkNames.Mainnet });

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

    logger.log(
        'get market details of token',
        await sdk.getMarketDetails({
            chainId: 1, //Linked chain id
            tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            provider: '', //specific provider optional
        })
    );
}

main()
    .catch(logger.error)
    .finally(() => process.exit());
