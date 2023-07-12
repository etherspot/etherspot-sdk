import { TokenTypes } from "../constants";

export class KnownContract {
  id: number;

  chainId: number;

  contractName: string;

  contractSymbol: string;

  contractAddress: string;

  tokenType: TokenTypes;

  nftVersion: string;

  decimals: number;

  underlyingToken: string;
}
