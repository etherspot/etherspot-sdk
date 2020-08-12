import { Sdk } from '../../src';
import { logger } from './common';

async function main(): Promise<void> {
  const sdk = new Sdk();

  logger.log('sdk', {
    a: 1,
  });
}

main().catch(logger.error);
