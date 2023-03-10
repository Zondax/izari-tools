# Izari Tools
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![node-current](https://img.shields.io/node/v/@zondax/izari-tools)
[![Package](https://badge.fury.io/js/%40zondax%2Fizari-tools.svg)](https://badge.fury.io/js/%40zondax%2Fizari-tools)
[![GithubActions](https://github.com/Zondax/izari-tools/actions/workflows/main.yaml/badge.svg)](https://github.com/Zondax/izari-tools/blob/master/.github/workflows/main.yaml)

## Introduction
Izari Tools is a comprehensive set of tools designed to interact with Blockchains. With its focus on compatibility, it provides developers with a versatile and flexible solution that can be used across a range of environments, 
from web projects using React to backend applications using NodeJS. It enables developers to easily manage and access blockchain data, including transactions, smart contracts, and assets.

Izari Tools makes it easy for developers to incorporate blockchain technology into their projects, unlocking new possibilities for innovation and growth.

Some key points: 
 - It is written in **Typescript**
 - It is composed by **pure JS**
 - It is tested on **many environments**
 - It is transpiled to two different flavours: 
   - **CommonJS (es2015)** 
   - **ESM (esnext)**

## Requisites 
- NodeJS >= 16.0.0

### React
- In order to use this package in browsers (like react, react-native, etc), some modules need to be polyfill (like Buffer, stream, etc). Most projects use
webpack to bundle JS code.  If your project uses it, please refer to [this](https://webpack.js.org/configuration/resolve/#resolvefallback) doc in order to configure it correctly. 
Besides, you could check [this blog post](https://viglucci.io/articles/how-to-polyfill-buffer-with-webpack-5) too. 

## Features

### Filecoin 
#### Node Comms

Allow you to communicate to the filecoin node in order to fetch on-chain data (miners, fees, nonce, etc), broadcast new transactions and more. 

| Feature                  | Supported?         |
|--------------------------|--------------------|
| Get next nonce           | :white_check_mark: |
| Estimate fees for new tx | :white_check_mark: |
| Broadcast a new tx       | :white_check_mark: |
| Read tx state            | :white_check_mark: |

#### Addresses

Allow you to easily handle the entire set of filecoin address types available. You will be able to inspect how each address is composed, convert from 
string format to bytes format, parse from both formats, etc. For more information about filecoin addresses, please 
refer to [this doc](https://spec.filecoin.io/appendix/address/)

| Feature           | ID (f0)              | SECP256K1 (f1)         | Actor (f2)            | BLS (f3)             | Delegated (f4)     |
|-------------------|----------------------|------------------------|-----------------------|----------------------|--------------------|
| Parse from string | :white_check_mark:   | :white_check_mark:     | :white_check_mark:    | :white_check_mark:   | :white_check_mark: |
| Parse from bytes  | :white_check_mark:   | :white_check_mark:     | :white_check_mark:    | :white_check_mark:   | :white_check_mark: |
| Encode to bytes   | :white_check_mark:   | :white_check_mark:     | :white_check_mark:    | :white_check_mark:   | :white_check_mark: |
| Encode to string  | :white_check_mark:   | :white_check_mark:     | :white_check_mark:    | :white_check_mark:   | :white_check_mark: |
| Get payload       | :white_check_mark:   | :white_check_mark:     | :white_check_mark:    | :white_check_mark:   | :white_check_mark: |
| Get protocol      | :white_check_mark:   | :white_check_mark:     | :white_check_mark:    | :white_check_mark:   | :white_check_mark: |
| Get network type  | :white_check_mark:   | :white_check_mark:     | :white_check_mark:    | :white_check_mark:   | :white_check_mark: |
| Get namespace     | :heavy_minus_sign:   | :heavy_minus_sign:     | :heavy_minus_sign:    | :heavy_minus_sign:   | :white_check_mark: |
| Get sub address   | :heavy_minus_sign:   | :heavy_minus_sign:     | :heavy_minus_sign:    | :heavy_minus_sign:   | :white_check_mark: |

#### Ethereum Addresses 
This is a particular case for a delegated address. Ethereum addresses on the Filecoin EVM are handled by the ethereum account manager, which actor id is 10. 
For this reason, there is a particular class to handle Ethereum addresses conversions. It will help you to get the filecoin equivalent address from an 
ethereum address, either string or bytes format. Besides, you can do the other way around: get the ethereum address from a filecoin one (f4/t4).


#### Tokens

Allow you to easily manage denominations used within Filecoin to do conversions between them, arithmetical operations, etc.

| Feature                         | Denomination       |
|---------------------------------|--------------------|
| Parse from string               | :white_check_mark: |
| Addition, subtraction, etc      | :white_check_mark: |
| Convert to other denominations  | :white_check_mark: |
| Positive, negative, zero        | :white_check_mark: |

**All denominations supported: atto, femto, pico, nano, micro, milli and whole.**

#### Transactions

In order to interact to the Filecoin network, transactions need to be sent to it. These features will allow you to create and manipulate them in an easy and
intuitive way. From creating new ones with minimum arguments or serializing them to CBOR or JSON, to fetch values from the network that they need in order to 
be valid to be sent. 

| Feature                              | Supported?         |
|--------------------------------------|--------------------|
| Create new instance                  | :white_check_mark: |
| Parse from raw json                  | :white_check_mark: |
| Parse from serialized                | :white_check_mark: |
| Export to json                       | :white_check_mark: |
| Serialize (to cbor)                  | :white_check_mark: |
| Prepare to send (get nonce and fees) | :white_check_mark: |

#### Wallet

These features group actions related to wallets itself: from creating new ones, deriving addresses
from it, and signing new txs to be broadcast.

| Feature                  | f1/secp256k1       | f3/bls             |
|--------------------------|--------------------|--------------------|
| Generate new mnemonic    | :white_check_mark: | :white_check_mark: |
| Derive key from seed     | :white_check_mark: | :x:                |
| Derive key from mnemonic | :white_check_mark: | :x:                |
| Sign transactions        | :white_check_mark: | :x:                |
| Verify signatures        | :white_check_mark: | :x:                |

#### Account

These features group actions related to high-level account features like send funds, fetch balances, etc.

| Feature               | Supported?          |
|-----------------------|---------------------|
| Send funds to address | :white_check_mark:  |
| Fetch current balance | :white_check_mark:  |

## Usage

### Install 

Just run the following command to add the package to your project

```yarn
yarn add @zondax/izari-tools
```
or 
```npm
npm install --save @zondax/izari-tools
```

### Use
The package can be imported easily on any place you need it. Choose the way to import it based on the loader module you use. 

For ESM modules
```typescript
import { Wallet, Transaction, Account } from "@zondax/izari-tools"
```

For CommonJS modules
```typescript
const { Wallet, Transaction, Account } = require("@zondax/izari-tools")
```

### Specific features
Inside this package there are several entry points grouped by features. If you only need to use specific features among all others, please choose the entry point you want to import from

| Entry point                       | Features                    | Project Folder           |
|-----------------------------------|-----------------------------|--------------------------|
| `@zondax/izari-tools`             | All features                | src/index.ts             | 
| `@zondax/izari-tools/rpc`         | Node Communications         | src/rpc/index.ts         | 
| `@zondax/izari-tools/address`     | Address                     | src/address/index.ts     | 
| `@zondax/izari-tools/transaction` | Transaction                 | src/transaction/index.ts | 
| `@zondax/izari-tools/wallet`      | Wallet                      | src/wallet/index.ts      | 
| `@zondax/izari-tools/account`     | Account                     | src/account/index.ts     | 
| `@zondax/izari-tools/artifacts`   | Types, constants and errors | src/artifacts/index.tx   |

**Note:** More information about these approach and its advantages can be found [here](https://webpack.js.org/guides/package-exports/) and [here](https://dev.to/binjospookie/exports-in-package-json-1fl2). 

#### Examples 
If I only need to convert some tokens between different denominations, both ways are valid.

Using the main entry point
```typescript
import { Token } from "@zondax/izari-tools"

const valueInFil = Token.fromAtto("10000000000000000")
```

Or just simply importing the token features
```typescript
import { Token } from "@zondax/izari-tools/token"

const valueInFil = Token.fromAtto("10000000000000000")
```

## Development
### Build
In order to install all required dependencies, just need to run the following command
```yarn
yarn install
```

Then, if you want to build the package, just need to run the following command. It will build both CJS and ESM flavours. 
```yarn
yarn build
```

### Testing 

The repo has established a set of rules to run ESLint in order to catch typos and possible bugs as soon as possible. 
```yarn
yarn lint
```

Besides the linter, a formatter is set in place to assure the same code style through our developers. 
```yarn
yarn format
```

Test cases generated automatically and are written in json files. Those files are consumed by jest to create on case for each scenario. In order to create those files
from a raw input file, just run the following command.
```yarn
yarn test:generate
```

Finally, in order to run tests, just do it by simply running the next command. 
```yarn
yarn test
```

**Notes**
- Please, there are some env vars you need to set first in order to run the tests. Check it first. 

## Tests

So far, the package has been tested in different environments. We are trying to assure it works in as many platforms as we can. 

### Environments
| Environments             | Tested?            |
|--------------------------|--------------------|
| NodeJS (CommonJS)        | :white_check_mark: |
| NodeJS (ESM)             | :white_check_mark: |
| Integration tests (Jest) | :white_check_mark: |
| React app                | :white_check_mark: |
| NextJS                   | :x:                |



### Web Browsers
| Web browsers    | Tested?            |
|-----------------|--------------------|
| Chromium        | :white_check_mark: |
| Firefox         | :x:                |
| Safari          | :x:                |

### Notes

#### Jest
- It was necessary to load ESM support on jest in order to be able to load some modules that has no support to CJS anymore. In particular, `@ipld/dag-cbor` is the one 
that forced us to do it. It was done following the [jest documentation site](https://jestjs.io/docs/ecmascript-modules).
- According to the [ts-jest documentation site](https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig), we are using a custom `tsconfig.json` file.
- TypeScript allows importing other TypeScript files with a .js extension, for compatibility with the ES6 modules loader specification. Unfortunately, Jest gets confused by this and complains that it's not able to find the JavaScript file. 
`jest-ts-webcompat-resolver` is the actual resolver we use in order to be able to handle imports with extensions. More info [here](https://github.com/AyogoHealth/jest-ts-webcompat-resolver).
- In order to generate test cases for addresses features, we are using a glif package called `@glif/filecoin-address`. Besides, generating transaction test cases is done by using zondax package called `@zondax/filecoin-signing-tools`


#### React
- React app is based on create-react-app utility. It has been [ejected](https://create-react-app.dev/docs/available-scripts/#npm-run-eject) in order
to configure webpack to polyfill some NodeJS native modules. In particular, you can find the custom configs added [here](https://github.com/Zondax/izari-tools/blob/791d58e06cb05b38cb7fe6f3532ca8e19b094c60/tests/package/react-app/config/webpack.config.js#L308)
and [here](https://github.com/Zondax/izari-tools/blob/791d58e06cb05b38cb7fe6f3532ca8e19b094c60/tests/package/react-app/config/webpack.config.js#L693).


https://jestjs.io/docs/ecmascript-modules

