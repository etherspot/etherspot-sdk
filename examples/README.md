# Etherspot SDK examples

These examples show how to combine the sdk calls to perform common functions.

## Prerequisites

* Start [local infra](https://github.com/etherspot/etherspot-infra) 

## Usage

```bash
$ npm run <example name> # eg. 01-session
```

## Examples
* [session](./src/01-session.ts) -- createSession and syncAccount
* [state storage](./src/02-state-storage.ts) -- get and set state
* [contract account](./src/03-contract-account.ts) -- get account and members, topUpAccount
* [ens](./src/04-ens.ts) -- reserve ENS name
* [p2p payments](./src/05-p2p-payments.ts) -- send payments across a payment channel
* [payment hub](./src/06-payment-hub.ts) -- deposits and payments in a payment hub
* [payment hub bridge](./src/07-payment-hub-bridge.ts) -- payments across a bridge
* [gateway](./src/08-gateway.ts) -- send transaction batch using gateway
* [projects](./src/09-projects.ts) -- call current project and add account owners
* [assets](./src/10-assets.ts) -- get token list for account
* [external contracts](./src/11-external-contracts.ts) -- transactions to ERC20 contract accounts
