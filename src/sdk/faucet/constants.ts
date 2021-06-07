import { NetworkNames } from '../network';

export const SUPPORTED_FAUCET_NETWORKS: { [key: string]: boolean } = {
  [NetworkNames.Etherspot]: true,
  [NetworkNames.LocalA]: true,
  [NetworkNames.LocalB]: true,
  [NetworkNames.LocalH]: true,
};
