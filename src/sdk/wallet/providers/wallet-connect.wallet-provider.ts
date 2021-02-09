import { BytesLike } from 'ethers';
import { TypedData } from 'ethers-typed-data';
import { isHex, keccak256, toHex } from '../../common';
import { DynamicWalletProvider } from './dynamic.wallet-provider';
import { WalletConnectConnector } from './interfaces';

export class WalletConnectWalletProvider extends DynamicWalletProvider {
  static connect(connector: WalletConnectConnector): WalletConnectWalletProvider {
    return new WalletConnectWalletProvider(connector);
  }

  protected constructor(readonly connector: WalletConnectConnector) {
    super('WalletConnect');

    try {
      const {
        accounts: [address],
        chainId,
      } = connector;

      this.setAddress(address);
      this.setNetworkName(chainId);
    } catch (err) {
      //
    }

    this.updateSessionHandler = this.updateSessionHandler.bind(this);

    connector.on('connect', this.updateSessionHandler);
    connector.on('session_update', this.updateSessionHandler);
    connector.on('disconnect', () => {
      this.setAddress(null);
      this.setNetworkName(null);
    });
  }

  async personalSignMessage(message: BytesLike): Promise<string> {
    const response = await this.connector.signPersonalMessage([
      toHex(message), //
      this.address,
    ]);

    return response || null;
  }

  async signMessage(message: string): Promise<string> {
    const response = await this.connector.signMessage([
      this.address, //
      isHex(message, 32) ? message : keccak256(message),
    ]);

    return response || null;
  }

  async signTypedData(typedData: TypedData): Promise<string> {
    const response = await this.connector.signTypedData([
      this.address, //
      typedData,
    ]);

    return response || null;
  }

  protected updateSessionHandler(error: Error, payload: { params: { accounts: string[]; chainId: number } }): void {
    let address: string = null;
    let chainId: number = null;

    if (!error) {
      try {
        ({
          accounts: [address],
          chainId,
        } = payload.params[0]);
      } catch (err) {
        address = null;
        chainId = null;
      }
    }

    this.setAddress(address);
    this.setNetworkName(chainId);
  }
}
