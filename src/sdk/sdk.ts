import { SdkOptions } from './interfaces';
import { DEFAULT_NETWORK_NAME } from './defaults';

/**
 * Sdk
 *
 * @category Sdk
 */
export class Sdk {
  constructor(options: SdkOptions = {}) {
    options = {
      networkName: DEFAULT_NETWORK_NAME,
      ...options,
    };
  }
}
