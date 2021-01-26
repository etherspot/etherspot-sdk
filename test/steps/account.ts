import { Given } from '@cucumber/cucumber';
import { World } from '../world';

Given(/^(.*) account$/, async function (this: World, name: string): Promise<void> {
  await this.createSdkInstance(name);
});

Given(/^(.*) account with balance (.*) ETH$/, async function (
  this: World,
  name: string,
  balance: string,
): Promise<void> {
  await this.createSdkInstance(name, balance);
});
