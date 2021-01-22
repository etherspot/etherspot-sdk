## Installation

[![NPM version][npm-image]][npm-url]

```bash
$ npm i ethers@^5.0.8 reflect-metadata@^0.1.13 rxjs@^6.6.2 -S
$ npm i etherspot -S
```

install `ws` (node.js only):

```bash
$ npm i ws -S
```

## Usage

```typescript
import { Sdk, randomPrivateKey } from 'etherspot';

const PRIVATE_KEY = randomPrivateKey();

async function main() {
  const sdk = new Sdk(PRIVATE_KEY);

  sdk.notifications$.subscribe(notification => console.log('notification:', notification));

  await sdk.computeContractAccount();

  const { account } = sdk.state;

  console.log('contract account:', account);

  // top-up contract account (account.address)

  // add transaction to gateway batch
  await sdk.batchExecuteAccountTransaction({
    to: '0xEEb4801FBc9781EEF20801853C1Cb25faB8A7a3b',
    value: 100, // 100 wei
  });

  console.log('gateway batch estimation:', await sdk.estimateGatewayBatch());

  console.log('submitted gateway batch:', await sdk.submitGatewayBatch());
}

main().catch(console.error);
```

## Resources

* [playground](https://try.etherspot.dev)

[npm-image]: https://badge.fury.io/js/etherspot.svg
[npm-url]: https://npmjs.org/package/etherspot

