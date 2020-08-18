# ETHERspot sdk

[![NPM version][npm-image]][npm-url]
![MIT licensed][license-image]

## Installation

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

## License

MIT

[npm-image]: https://badge.fury.io/js/etherspot.svg
[npm-url]: https://npmjs.org/package/etherspot
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg

