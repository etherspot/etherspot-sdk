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

// Feature flags for Services screen items and other constants fetched from
// Firebase Remote Config
export const REMOTE_CONFIG = {
  FEATURE_OFFERS_ENGINE: 'feature_services_offers_engine',
  FEATURE_RAMP: 'feature_services_ramp',
  FEATURE_LIQUIDITY_POOLS: 'feature_services_liquidity_pools',
  FEATURE_STORIES: 'feature_stories',
  KEY_BASED_ASSETS_MIGRATION: 'app_assets_show_kw_migration',
  SMART_WALLET_ACTIVATION_PAID_BY_PILLAR: 'app_smart_wallet_paid_for_by_pillar',
  APP_FEES_PAID_WITH_PLR: 'app_fees_paid_with_plr',
  APP_LOCALES_URL: 'app_locales_url',
  APP_LOCALES_LATEST_TIMESTAMP: 'app_locales_latest_timestamp',
  APP_SOCIAL_DISCORD: 'app_social_discord',
  APP_SOCIAL_TWITTER: 'app_social_twitter',
  APP_SOCIAL_YOUTUBE: 'app_social_youtube',
  LEGAL_HTML_ENDPOINT_PREFIX: 'app_legal_html_endpoint_prefix',
  FEATURE_ONBOARDING_TUTORIAL: 'feature_onboarding_tutorial',
  WALLET_MIGRATION_ARCHANOVA_ENABLED: 'feature_archanova_migrator_tool',
  ENS_MIGRATOR_ENABLED: 'ens_migrator_enabled',
  KNOWLEDGEBASE_URL: 'knowledgebase_url',
  FEATURE_STORIES_ANDROID_HEIGHT: 'feature_stories_android_height',
  FEATURE_STORIES_ANDROID_WIDTH: 'feature_stories_android_width',
  FEATURE_STORIES_ANDROID_CORNER_RADIUS: 'feature_stories_android_corner_radius',
  FEATURE_STORIES_IOS_HEIGHT: 'feature_stories_ios_height',
  FEATURE_STORIES_IOS_WIDTH: 'feature_stories_ios_width',
  FEATURE_STORIES_IOS_CORNER_RADIUS: 'feature_stories_ios_corner_radius',
  FEATURE_TOKEN_LIST_ETHEREUM: 'app_tokenlist_name',
  FEATURE_TOKEN_LIST_POLYGON: 'app_polygon_tokenlist_name',
  FEATURE_TOKEN_LIST_BSC: 'app_bsc_tokenlist_name',
  PRISMIC_PRIVACY_POLICY_DOCUMENT_ID: 'prismic_privacy_policy_document_id',
  PRISMIC_TERMS_OF_POLICY_DOCUMENT_ID: 'prismic_terms_of_policy_document_id',
  PRISMIC_INTERJECTION_DOCUMENT_ID: 'prismic_interjection_document_id',
  FEATURE_WC_DASHBOARD_INAPPBROWSER: 'feature_wc_dashboard_inappbrowser',
  TRANSACTION_REVERTED_ARTICLE_URL: 'transaction_reverted_article_url',
  FEATURE_EXCHANGE_FEE_CAPTURE: 'feature_exchange_fee_capture',
  EXCHANGE_FEE_MAINNET_CAPTURE_ADDRESS: 'exchange_fee_mainnet_capture_address',
  EXCHANGE_FEE_XDAI_CAPTURE_ADDRESS: 'exchange_fee_xdai_capture_address',
  EXCHANGE_FEE_POLYGON_CAPTURE_ADDRESS: 'exchange_fee_polygon_capture_address',
  EXCHANGE_FEE_BSC_CAPTURE_ADDRESS: 'exchange_fee_bsc_capture_address',
  EXCHANGE_FEE_CAPTURE_PERCENTAGE: 'exchange_fee_capture_percentage',
  EXCHANGE_AMOUNT_DECIMAL_PLACES: 'exchange_amount_decimal_places',
  FEATURE_WERT_COMMODITIES: 'feature_wert_commodities',
  FEATURE_WERT_CURRENCY: 'feature_wert_currency',
  FEATURE_WERT_COMMODITY: 'feature_wert_commodity',
  APP_API_USER_ENDPOINT: 'app_api_user_endpoint',
  INFURA_PROJECT_ID: 'infura_project_id',
  FEATURE_ONBOARDING_ENS: 'feature_onboarding_ens',
  APP_IPFS_SERVICE_URL: 'app_ipfs_service_url',
};

// These are used as a fallback in case firebase fails to fetch actual values
export const INITIAL_REMOTE_CONFIG = {
  [REMOTE_CONFIG.FEATURE_OFFERS_ENGINE]: true,
  [REMOTE_CONFIG.FEATURE_RAMP]: true,
  [REMOTE_CONFIG.FEATURE_STORIES]: true,
  [REMOTE_CONFIG.FEATURE_LIQUIDITY_POOLS]: true,
  [REMOTE_CONFIG.KEY_BASED_ASSETS_MIGRATION]: true,
  [REMOTE_CONFIG.APP_FEES_PAID_WITH_PLR]: false,
  [REMOTE_CONFIG.APP_LOCALES_URL]: 'test',
  [REMOTE_CONFIG.APP_LOCALES_LATEST_TIMESTAMP]: '1',
  [REMOTE_CONFIG.APP_SOCIAL_DISCORD]: 'https://chat.pillar.fi',
  [REMOTE_CONFIG.APP_SOCIAL_TWITTER]: 'https://twitter.com/pillarwallet',
  [REMOTE_CONFIG.APP_SOCIAL_YOUTUBE]: 'https://www.youtube.com/channel/UCXIvBMfmYVmrV6dHIqIxEYA',
  [REMOTE_CONFIG.LEGAL_HTML_ENDPOINT_PREFIX]:
    'https://s3.eu-west-2.amazonaws.com/pillar-prod-core-profile-images/legal/',
  [REMOTE_CONFIG.FEATURE_ONBOARDING_TUTORIAL]: false,
  [REMOTE_CONFIG.WALLET_MIGRATION_ARCHANOVA_ENABLED]: true,
  [REMOTE_CONFIG.ENS_MIGRATOR_ENABLED]: false,
  [REMOTE_CONFIG.KNOWLEDGEBASE_URL]: 'https://help.pillarproject.io/',
  [REMOTE_CONFIG.FEATURE_STORIES_ANDROID_HEIGHT]: '200',
  [REMOTE_CONFIG.FEATURE_STORIES_ANDROID_WIDTH]: '200',
  [REMOTE_CONFIG.FEATURE_STORIES_ANDROID_CORNER_RADIUS]: '40',
  [REMOTE_CONFIG.FEATURE_STORIES_IOS_HEIGHT]: '100',
  [REMOTE_CONFIG.FEATURE_STORIES_IOS_WIDTH]: '100',
  [REMOTE_CONFIG.FEATURE_STORIES_IOS_CORNER_RADIUS]: '20',
  [REMOTE_CONFIG.FEATURE_TOKEN_LIST_ETHEREUM]: 'PillarTokens',
  [REMOTE_CONFIG.FEATURE_TOKEN_LIST_POLYGON]: 'PillarTokens',
  [REMOTE_CONFIG.FEATURE_TOKEN_LIST_BSC]: 'PillarTokens',
  [REMOTE_CONFIG.PRISMIC_PRIVACY_POLICY_DOCUMENT_ID]: 'YNGoWxIAACMAsjF2',
  [REMOTE_CONFIG.PRISMIC_TERMS_OF_POLICY_DOCUMENT_ID]: 'YNGo8hIAACMAsjRR',
  [REMOTE_CONFIG.PRISMIC_INTERJECTION_DOCUMENT_ID]: 'YNsHjxIAACIAw0ca',
  [REMOTE_CONFIG.FEATURE_WC_DASHBOARD_INAPPBROWSER]: false,
  [REMOTE_CONFIG.TRANSACTION_REVERTED_ARTICLE_URL]:
    'https://help.pillar.fi/en/articles/5556539-why-transactions-get-reverted',
  [REMOTE_CONFIG.FEATURE_EXCHANGE_FEE_CAPTURE]: true,
  [REMOTE_CONFIG.EXCHANGE_FEE_MAINNET_CAPTURE_ADDRESS]: '0x5eD06523f9195bB6E69aE22040E85ae006915e7f',
  [REMOTE_CONFIG.EXCHANGE_FEE_XDAI_CAPTURE_ADDRESS]: '0xDF348Ec9742D1A94F3Cc721d85f5D8cB71292b5d',
  [REMOTE_CONFIG.EXCHANGE_FEE_POLYGON_CAPTURE_ADDRESS]: '0x370631d0C26F52331DF4efCBe59b679315da983F',
  [REMOTE_CONFIG.EXCHANGE_FEE_BSC_CAPTURE_ADDRESS]: '0xBda4bA77F5340c74f430d49120abfe0BDDAD122a',
  [REMOTE_CONFIG.EXCHANGE_FEE_CAPTURE_PERCENTAGE]: 0.85,
  [REMOTE_CONFIG.EXCHANGE_AMOUNT_DECIMAL_PLACES]: 4,
  [REMOTE_CONFIG.FEATURE_WERT_COMMODITIES]: 'MATIC',
  [REMOTE_CONFIG.FEATURE_WERT_COMMODITY]: 'MATIC',
  [REMOTE_CONFIG.FEATURE_WERT_CURRENCY]: 'USD',
  [REMOTE_CONFIG.APP_API_USER_ENDPOINT]: 'https://us-central1-pillar-project-1506420699556.cloudfunctions.net/api',
  [REMOTE_CONFIG.INFURA_PROJECT_ID]: '',
  [REMOTE_CONFIG.FEATURE_ONBOARDING_ENS]: false,
  [REMOTE_CONFIG.APP_IPFS_SERVICE_URL]: 'https://ipfs.io/ipfs',
};
