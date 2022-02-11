

import ethers from 'ethers';

export namespace ERC721_TRANSFER_METHODS {
  export const TRANSFER = 'transfer';
  export const TRANSFER_FROM = 'transferFrom';
  export const SAFE_TRANSFER_FROM = 'safeTransferFrom';
};


export type ERC721_TRANSFER_METHODS = typeof ERC721_TRANSFER_METHODS[keyof typeof ERC721_TRANSFER_METHODS];

export const encodeContractMethod = (
  contractAbi: string | Object[],
  method: string,
  params: any,
): string => {
  const contractInterface = new ethers.utils.Interface(contractAbi);
  return contractInterface.encodeFunctionData(method, params);
};

// TODO buildERC721TransactionData

// export const buildERC721TransactionData = async (
//   { from, to, tokenId, contractAddress, useLegacyTransferMethod }: Erc721TransactionPayload,
//   customProvider?: any,
// ): string => {
//   const provider = customProvider || getEthereumProvider(getEnv().NETWORK_PROVIDER);

//   const code = await provider.getCode(contractAddress);
//   const receiverCode = await provider.getCode(to);
//   // regular address will return exactly 0x while contract address will return 0x...0
//   const isReceiverContractAddress = receiverCode && receiverCode.length > 2;

//   const contractTransferMethod = getERC721ContractTransferMethod(
//     code,
//     isReceiverContractAddress,
//     useLegacyTransferMethod,
//   );

//   let contractAbi;
//   let params;
//   switch (contractTransferMethod) {
//     case ERC721_TRANSFER_METHODS.SAFE_TRANSFER_FROM:
//       contractAbi = ERC721_CONTRACT_ABI_SAFE_TRANSFER_FROM;
//       params = [from, to, tokenId];
//       break;
//     case ERC721_TRANSFER_METHODS.TRANSFER:
//       contractAbi = ERC721_CONTRACT_ABI_TRANSFER;
//       params = [to, tokenId];
//       break;
//     case ERC721_TRANSFER_METHODS.TRANSFER_FROM:
//       contractAbi = ERC721_CONTRACT_ABI_TRANSFER_FROM;
//       params = [from, to, tokenId];
//       break;
//     default:
//       break;
//   }

//   // $FlowFixMe – asks for contractAbi to be surely initialized
//   return encodeContractMethod(contractAbi, contractTransferMethod, params);
// };