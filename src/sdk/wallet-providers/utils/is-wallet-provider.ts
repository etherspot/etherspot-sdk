import { WalletProviderLike } from '../interfaces';

export function isWalletProvider(provider: WalletProviderLike): boolean {
  return (
    provider && //
    typeof provider === 'object' &&
    provider.type &&
    typeof provider.personalSignMessage === 'function' &&
    typeof provider.signMessage === 'function' &&
    typeof provider.signTypedData === 'function'
  );
}
