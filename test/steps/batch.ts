import { Then, When } from '@cucumber/cucumber';
import expect from 'expect';
import { World } from '../world';

When(/^(.*) estimates batch$/, async function (this: World, name: string): Promise<void> {
  const sdk = this.getSdkInstance(name);

  await sdk.estimateGatewayBatch();
});

When(/^(.*) submits batch$/, async function (this: World, name: string): Promise<void> {
  const sdk = this.getSdkInstance(name);

  await sdk.submitGatewayBatch();
});

Then(/^(.*) batch should be empty$/, async function (this: World, name: string): Promise<void> {
  const sdk = this.getSdkInstance(name);

  expect(sdk.state.gatewayBatch).toBeNull();
});
