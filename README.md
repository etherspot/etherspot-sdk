# ETHERspot sdk

[![NPM version][npm-image]][npm-url]
![MIT licensed][license-image]

## Installation

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

async function main(): Promise<void> {
  const sdk = new Sdk(PRIVATE_KEY);

  sdk.notifications$.subscribe(notification => console.log('notification:', notification))
  
  await sdk.computeContractAccount();

  // add transaction to gateway batch
  await sdk.batchExecuteAccountTransaction({
    to: '0x...',
    value: 100,
  })
  
  console.log('gateway batch estimation:', await sdk.estimateGatewayBatch());

  console.log('submitted gateway batch:', await sdk.submitGatewayBatch());
}

main().catch(console.error);
```

## Resources

* [playground](https://try.etherspot.dev)
* [documentation](https://docs.etherspot.dev)

## License

MIT

[npm-image]: https://badge.fury.io/js/etherspot.svg
[npm-url]: https://npmjs.org/package/etherspot
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg

