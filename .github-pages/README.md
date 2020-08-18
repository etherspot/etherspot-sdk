## Installation

[![NPM version][npm-image]][npm-url]

```bash
$ npm i etherspot -S
```

install `peerDependencies`:

```bash
$ npm i @apollo/client ethers reflect-metadata rxjs subscriptions-transport-ws -S
```

install `ws` (node.js only):

```bash
$ npm i ws -S
```

## Usage

```typescript
import { Sdk } from 'etherspot';
import { Wallet } from 'ethers';

const sdk = new Sdk(Wallet.createRandom());

```

[npm-image]: https://badge.fury.io/js/etherspot.svg
[npm-url]: https://npmjs.org/package/etherspot

