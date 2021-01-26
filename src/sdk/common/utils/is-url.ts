/* eslint-disable @typescript-eslint/camelcase */
import validator from 'validator';

/**
 * @ignore
 */
export function isUrl(url: string): boolean {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_tld: false,
    require_host: true,
    require_protocol: true,
  });
}
