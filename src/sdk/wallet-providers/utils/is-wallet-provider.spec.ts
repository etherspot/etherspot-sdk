import { randomPrivateKey } from '../../common';
import { KeyWalletProvider } from '../key.wallet-provider';
import { isWalletProvider } from './is-wallet-provider';

describe('isWalletProvider()', () => {
  const privateKey = randomPrivateKey();

  it('expect to return true on private key', () => {
    expect(isWalletProvider(privateKey)).toBeTruthy();
  });

  it('expect to return false on non hex32 string', () => {
    expect(isWalletProvider('0x0123')).toBeFalsy();
  });

  it('expect to return true on wallet like', () => {
    expect(
      isWalletProvider({
        privateKey,
      }),
    ).toBeTruthy();
  });

  it('expect to return true on wallet provider', () => {
    const walletProvider = new KeyWalletProvider(privateKey);

    expect(isWalletProvider(walletProvider)).toBeTruthy();
  });
});
