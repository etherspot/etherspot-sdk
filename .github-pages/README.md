## Installation

[![NPM version][npm-image]][npm-url]

```bash
$ npm i etherspot -S
```

install `peerDependencies`:

```bash
$ npm i ethers@^5.0.8 reflect-metadata@^0.1.13 rxjs@^6.6.2 -S
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

## Resources

* [playground](https://etherspot.dev)

[npm-image]: https://badge.fury.io/js/etherspot.svg
[npm-url]: https://npmjs.org/package/etherspot

