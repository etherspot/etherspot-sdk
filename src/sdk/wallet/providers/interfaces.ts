export interface KeyWalletProviderOptions {
  privateKey: string;
}

export interface MetaMaskWindow {
  ethereum: Partial<{
    isMetaMask: boolean;
    autoRefreshOnNetworkChange: boolean;
    networkVersion: string;
    selectedAddress: string;

    enable(): Promise<string[]>;

    on<T>(event: string, callback: (data: T) => any): void;

    send<T = any>(
      method: string,
      params?: any[],
    ): Promise<{
      result: T;
      error: any;
    }>;
  }>;
}
