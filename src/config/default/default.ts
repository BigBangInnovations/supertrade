import { DEFAULT_APP_DATA } from './app-data';
import { DEFAULT_META_DATA } from './meta-data';

export const DEFAULT_CONFIG = {
  // apiEndpoint: 'http://localhost/superloyalapi/superloyalapi/',
  apiEndpoint: 'http://34.219.152.38/superloyaldevapi/',
  appName: 'SuperTrade',
  fevicon: '/assets/default/favicon.ico',
  encKey: '$bigang_Secure@production',
  rpp: 5,
  frontEndUrl: 'localhost:4200',

  ...DEFAULT_APP_DATA,
  ...DEFAULT_META_DATA,
};
