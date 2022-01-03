# Etherspot SDK

[![NPM version][npm-image]][npm-url]
![MIT licensed][license-image]

<a href="https://www.etherspot.io">
<img src=".github/logo.png" width="100"/>
</a>
 

Etherspot is a blockchain development framework for EVM-compatible chains that creates direct state channel bridges to provide a seamless user experience across chains and wallets.

With just one deposit you’re able to onboard your users to the entire multichain world.

More information at [etherspot.io](https://www.etherspot.io)

## Resources

* [playground](https://try.etherspot.dev)
* [documentation](https://docs.etherspot.dev)
* [examples](https://github.com/etherspot/etherspot-sdk/tree/develop/examples)

## Installation

```bash
$ npm i ethers@^5.5.2 reflect-metadata@^0.1.13 rxjs@^6.6.2 -S
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


## License

MIT

[npm-image]: https://badge.fury.io/js/etherspot.svg
[npm-url]: https://npmjs.org/package/etherspot
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg

