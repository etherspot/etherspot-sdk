import { Wallet } from 'ethers';
import { Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const wallet = Wallet.createRandom();
  const sdk = new Sdk(wallet);

  const tokenLists = await sdk.getTokenLists();

  logger.log('token lists', await sdk.getTokenLists());

  const { name } = tokenLists[1];

  let tokenListTokens = await sdk.getTokenListTokens();

  logger.log('default token list tokens length', tokenListTokens.length);

  tokenListTokens = await sdk.getTokenListTokens({
    name,
  });

  logger.log(`${name} token list tokens length`, tokenListTokens.length);

  tokenListTokens = await sdk.getAccountTokenListTokens();

  logger.log(`default account token list tokens length`, tokenListTokens.length);

  tokenListTokens = await sdk.getAccountTokenListTokens({
    name,
  });

  logger.log(`${name} account token list tokens length`, tokenListTokens.length);

  tokenListTokens = await sdk.getAccountTokenListTokens();

  logger.log('new default account token list tokens length', tokenListTokens.length);

  const { address: token } = tokenListTokens[0];

  logger.log(
    `is ${token} token exists on default list`,
    await sdk.isTokenOnTokenList({
      token,
    }),
  );
}

main()
  .catch(logger.error)
  .finally(() => process.exit());
