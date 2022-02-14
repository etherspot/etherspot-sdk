// @flow
/*
    Pillar Wallet: the personal data locker
    Copyright (C) 2019 Stiftung Pillar Project

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/
/* eslint-disable i18next/no-literal-string */
require('dotenv').config()


import { DEVELOPMENT, STAGING, PRODUCTION } from '../constants/envConstants';

import { buildEnvironment, devOptions } from './buildConfig';



const buildType = process.env.__DEV__ ? DEVELOPMENT : PRODUCTION;


type CurrentEnvironment = {
  [key:string]: string,
};

// switchable environments constants
const envVars = {
  production: {
    ENVIRONMENT: PRODUCTION,
    TX_DETAILS_URL_ETHEREUM: 'https://etherscan.io/tx/',
    TX_DETAILS_URL_BINANCE: 'https://bscscan.com/tx/',
    TX_DETAILS_URL_POLYGON: 'https://polygonscan.com/tx/',
    TX_DETAILS_URL_XDAI: 'https://blockscout.com/xdai/mainnet/tx/',
    TX_DETAILS_URL_AVALANCHE: 'https://snowtrace.io/tx/',
    NETWORK_PROVIDER: 'homestead',
    COLLECTIBLES_NETWORK: 'homestead',
    OPEN_SEA_API: 'https://api.opensea.io/api/v1',
    RAMPNETWORK_WIDGET_URL: 'https://buy.ramp.network/',
    NEWSLETTER_SUBSCRIBE_URL:
      'https://pillarproject.us14.list-manage.com/subscribe/post-json?u=0056162978ccced9e0e2e2939&amp;id=637ab55cf8',
    SABLIER_CONTRACT_ADDRESS: '0xA4fc358455Febe425536fd1878bE67FfDBDEC59a',
    SABLIER_SUBGRAPH_NAME: 'sablierhq/sablier',
    SYNTHETIX_EXCHANGE_ADDRESS: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    SYNTHETIX_RATES_ADDRESS: '0xda80E6024bC82C9fe9e4e6760a9769CF0D231E80',
    UNISWAP_CACHED_SUBGRAPH_ASSETS_URL: 'https://pillar-prod-token-cacher-files.s3.eu-west-2.amazonaws.com/uniswap.csv',
    RARI_SUBGRAPH_NAME: 'graszka22/rari-transactions',
    MSTABLE_SUBGRAPH_NAME: 'mstable/mstable-protocol',
    MSTABLE_CONTRACT_ADDRESS: '0xe2f2a5C287993345a840Db3B0845fbC70f5935a5',
    MSTABLE_VALIDATION_HELPER_CONTRACT_ADDRESS: '0xabcc93c3be238884cc3309c19afd128fafc16911',
    RARI_GOVERNANCE_TOKEN_CONTRACT_ADDRESS: '0xD291E7a03283640FDc51b121aC401383A46cC623',
    RARI_RGT_DISTRIBUTOR_CONTRACT_ADDRESS: '0x9C0CaEb986c003417D21A7Daaf30221d61FC1043',
    UNISWAP_SUBGRAPH_NAME: 'uniswap/uniswap-v2',
    PRISMIC_ENDPOINT_URL: 'https://pillar-app.cdn.prismic.io/api/v2',
    ARCHANOVA_MIGRATOR_CONTRACT_V1_ADDRESS: '0xAF628C207513c5E51d894b3733056B8080634923',
    ARCHANOVA_MIGRATOR_CONTRACT_V2_ADDRESS: '0x80463f318075c893e343eec461bbeb445fde7951',
    ...buildEnvironment,
    ...devOptions,
  },
  staging: {
    ENVIRONMENT: STAGING,
    TX_DETAILS_URL_ETHEREUM: 'https://kovan.etherscan.io/tx/',
    TX_DETAILS_URL_BINANCE: 'https://bscscan.com/tx/',
    TX_DETAILS_URL_POLYGON: 'https://polygonscan.com/tx/',
    TX_DETAILS_URL_XDAI: 'https://blockscout.com/xdai/mainnet/tx/',
    TX_DETAILS_URL_AVALANCHE: 'https://testnet.snowtrace.io/tx/',
    NETWORK_PROVIDER: 'kovan',
    COLLECTIBLES_NETWORK: 'rinkeby',
    OPEN_SEA_API: 'https://rinkeby-api.opensea.io/api/v1',
    RAMPNETWORK_WIDGET_URL: 'https://ri-widget-staging-kovan.firebaseapp.com/',
    NEWSLETTER_SUBSCRIBE_URL:
      'https://pillarproject.us14.list-manage.com/subscribe/post-json?u=0056162978ccced9e0e2e2939&amp;id=637ab55cf8',
    SABLIER_CONTRACT_ADDRESS: '0xc04Ad234E01327b24a831e3718DBFcbE245904CC',
    SABLIER_SUBGRAPH_NAME: 'sablierhq/sablier-kovan',
    SYNTHETIX_EXCHANGE_ADDRESS: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    SYNTHETIX_RATES_ADDRESS: '0xA36f5A656c48EB0b43b63293E690DA746162d40B',
    UNISWAP_CACHED_SUBGRAPH_ASSETS_URL: 'https://pillar-qa-token-cacher-files.s3.eu-west-2.amazonaws.com/uniswap.csv',
    RARI_SUBGRAPH_NAME: 'graszka22/rari-transactions',
    MSTABLE_SUBGRAPH_NAME: 'mstable/mstable-protocol',
    MSTABLE_CONTRACT_ADDRESS: '0xe2f2a5C287993345a840Db3B0845fbC70f5935a5',
    MSTABLE_VALIDATION_HELPER_CONTRACT_ADDRESS: '0xabcc93c3be238884cc3309c19afd128fafc16911',
    RARI_GOVERNANCE_TOKEN_CONTRACT_ADDRESS: '0xD291E7a03283640FDc51b121aC401383A46cC623',
    RARI_RGT_DISTRIBUTOR_CONTRACT_ADDRESS: '0x9C0CaEb986c003417D21A7Daaf30221d61FC1043',
    UNISWAP_SUBGRAPH_NAME: 'graszka22/uniswapv2-kovan',
    PRISMIC_ENDPOINT_URL: 'https://pillar-app.cdn.prismic.io/api/v2',
    ARCHANOVA_MIGRATOR_CONTRACT_V1_ADDRESS: '0x2308697b9976921B463d0f42abA5A7e6f288E5C3',
    ARCHANOVA_MIGRATOR_CONTRACT_V2_ADDRESS: '0x44Dc02a2498467C67671888401efD61320D3EBFB',
    ...buildEnvironment,
    ...devOptions,
  },
};

const rariPoolsEnv = {
  staging: {
    STABLE_POOL: {
      RARI_FUND_MANAGER_CONTRACT_ADDRESS: '0xC6BF8C8A55f77686720E0a88e2Fd1fEEF58ddf4a',
      RARI_FUND_PROXY_CONTRACT_ADDRESS: '0xe4deE94233dd4d7c2504744eE6d34f3875b3B439',
      RARI_FUND_TOKEN_ADDRESS: '0x016bf078ABcaCB987f0589a6d3BEAdD4316922B0',
    },
    YIELD_POOL: {
      RARI_FUND_MANAGER_CONTRACT_ADDRESS: '0x59FA438cD0731EBF5F4cDCaf72D4960EFd13FCe6',
      RARI_FUND_PROXY_CONTRACT_ADDRESS: '0x35DDEFa2a30474E64314aAA7370abE14c042C6e8',
      RARI_FUND_TOKEN_ADDRESS: '0x3baa6B7Af0D72006d3ea770ca29100Eb848559ae',
    },
    ETH_POOL: {
      RARI_FUND_MANAGER_CONTRACT_ADDRESS: '0xD6e194aF3d9674b62D1b30Ec676030C23961275e',
      RARI_FUND_PROXY_CONTRACT_ADDRESS: '0xa3cc9e4B9784c80a05B3Af215C32ff223C3ebE5c',
      RARI_FUND_TOKEN_ADDRESS: '0xCda4770d65B4211364Cb870aD6bE19E7Ef1D65f4',
      RARI_FUND_CONTROLLER_CONTRACT_ADDRESS: '0xD9F223A36C2e398B0886F945a7e556B41EF91A3C',
    },
  },
  production: {
    STABLE_POOL: {
      RARI_FUND_MANAGER_CONTRACT_ADDRESS: '0xC6BF8C8A55f77686720E0a88e2Fd1fEEF58ddf4a',
      RARI_FUND_PROXY_CONTRACT_ADDRESS: '0xe4deE94233dd4d7c2504744eE6d34f3875b3B439',
      RARI_FUND_TOKEN_ADDRESS: '0x016bf078ABcaCB987f0589a6d3BEAdD4316922B0',
    },
    YIELD_POOL: {
      RARI_FUND_MANAGER_CONTRACT_ADDRESS: '0x59FA438cD0731EBF5F4cDCaf72D4960EFd13FCe6',
      RARI_FUND_PROXY_CONTRACT_ADDRESS: '0x35DDEFa2a30474E64314aAA7370abE14c042C6e8',
      RARI_FUND_TOKEN_ADDRESS: '0x3baa6B7Af0D72006d3ea770ca29100Eb848559ae',
    },
    ETH_POOL: {
      RARI_FUND_MANAGER_CONTRACT_ADDRESS: '0xD6e194aF3d9674b62D1b30Ec676030C23961275e',
      RARI_FUND_PROXY_CONTRACT_ADDRESS: '0xa3cc9e4B9784c80a05B3Af215C32ff223C3ebE5c',
      RARI_FUND_TOKEN_ADDRESS: '0xCda4770d65B4211364Cb870aD6bE19E7Ef1D65f4',
      RARI_FUND_CONTROLLER_CONTRACT_ADDRESS: '0xD9F223A36C2e398B0886F945a7e556B41EF91A3C',
    },
  },
};

// default environment before switching
let storedEnv = buildType === PRODUCTION ? PRODUCTION : STAGING;

export const getEnv = (): CurrentEnvironment => envVars[storedEnv];

// export const getRariPoolsEnv = (rariPool: RariPool): CurrentEnvironment => rariPoolsEnv[storedEnv][rariPool];
