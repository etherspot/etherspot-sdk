
export namespace ERC721_TRANSFER_METHODS  {
    export const TRANSFER = 'transfer';
    export const TRANSFER_FROM = 'transferFrom';
    export const SAFE_TRANSFER_FROM = 'safeTransferFrom';
  };
  

export type ERC721_TRANSFER_METHODS = typeof ERC721_TRANSFER_METHODS[keyof typeof ERC721_TRANSFER_METHODS];