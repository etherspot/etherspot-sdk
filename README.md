# ETHERspot sdk

[![NPM version][npm-image]][npm-url]
![MIT licensed][license-image]

## Installation

```bash
$ npm i ethers@^5.0.8 reflect-metadata@^0.1.13 rxjs@^6.6.2 -S
$ npm i etherspot -S
$ npm i ws -s # node.js only
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
* [documentation](https://docs.etherspot.dev)
* examples:
    * [session](./examples/src/01-session.ts)
    * [state storage](./examples/src/02-state-storage.ts)
    * [contract account](./examples/src/03-contract-account.ts)
    * [ens](./examples/src/04-ens.ts)
    * [p2p payments](./examples/src/05-p2p-payments.ts)
    * [payment hub](./examples/src/06-payment-hub.ts)
    * [payment hub bridge](./examples/src/07-payment-hub-bridge.ts)
    * [gateway](./examples/src/08-gateway.ts)
    * [projects](./examples/src/09-projects.ts)
    * [assets](./examples/src/10-assets.ts)

## License

MIT

[npm-image]: https://badge.fury.io/js/etherspot.svg
[npm-url]: https://npmjs.org/package/etherspot
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg

