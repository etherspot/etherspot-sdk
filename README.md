# Etherspot SDK

## **Deprecation Notice (PLEASE READ)**

>[!WARNING]
>This is the **OLD** version of the Etherspot SDK. 

ERC4337 is the new standard for [Account Abstraction on Ethereum.](https://www.erc4337.io/) 
Any Account Abstraction development done on EVM based networks going forward should be done using this standard.

This SDK is pre 4337 and **not** being updated anymore. 

Please refer to the links below and use Etherspot Prime going forward:
- [Etherspot Prime Github Repo](https://github.com/etherspot/etherspot-prime-sdk)
- [Etherspot Prime Documentation](https://etherspot.fyi/introduction)

-----------------
[![NPM version][npm-image]][npm-url]
![MIT licensed][license-image]

<a href="https://www.etherspot.io">
<img src=".github/etherspot_logo.png" width="100"/>
</a>
 

Etherspot is a blockchain development framework for EVM-compatible chains that creates direct state channel bridges to provide a seamless user experience across chains and wallets.

With just one deposit you’re able to onboard your users to the entire multichain world.

Developers can use the Buidler and TransactionKit tools to easily include Etherspot features into their dapps.

For more powerful but complex uses, developers can dive deeper into the SDK and explore a number of custom use cases.

More information at [etherspot.io](https://www.etherspot.io)

## Resources

* [Playground](https://try.etherspot.dev)
* [BUIDLer](https://buidler.etherspot.io/)
* [TransactionKit](https://etherspot.io/transactionkit/)
* [Documentation](https://docs.etherspot.dev)
* [Examples](https://github.com/etherspot/etherspot-sdk/tree/develop/examples)

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

## Notification of transactions

notification of transactions is not available for fuse

## Transaction History on Klaytn

History of transactions would be incomplete only on Klaytn Network due to lack of resources for fetching the required data


## License

MIT

[npm-image]: https://badge.fury.io/js/etherspot.svg
[npm-url]: https://npmjs.org/package/etherspot
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg

