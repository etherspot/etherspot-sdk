import { Wallet } from 'ethers';
import { Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();
  const sdk = new Sdk(wallet);

  const tokensLists = await sdk.getTokensLists();

  logger.log('tokens lists', await sdk.getTokensLists());

  const { name } = tokensLists[1];

  let tokenListTokens = await sdk.getTokensListTokens();

  logger.log('default tokens list tokens length', tokenListTokens.length);

  tokenListTokens = await sdk.getTokensListTokens({
    name,
  });

  logger.log(`${name} tokens list tokens length`, tokenListTokens.length);

  tokenListTokens = await sdk.getAccountTokensListTokens();

  logger.log(`default account tokens list tokens length`, tokenListTokens.length);

  tokenListTokens = await sdk.getAccountTokensListTokens({
    name,
  });

  logger.log(`${name} tokens account list tokens length`, tokenListTokens.length);

  tokenListTokens = await sdk.getAccountTokensListTokens();

  logger.log('new default account tokens list tokens length', tokenListTokens.length);

  const { address: token } = tokenListTokens[0];

  logger.log(
    `is ${token} token exists on default list`,
    await sdk.isTokenOnTokensList({
      token,
    }),
  );
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
