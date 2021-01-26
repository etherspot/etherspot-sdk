import { When } from '@cucumber/cucumber';
import { World } from '../world';
import { randomAddress } from '../utils';

When(/^(.*) adds execute random account transaction to batch$/, async function (
  this: World,
  name: string,
): Promise<void> {
  const sdk = this.getSdkInstance(name);

  await sdk.batchExecuteAccountTransaction({
    to: randomAddress(),
    value: 1,
  });
});
