import { constants, utils } from 'ethers';

export function computePaymentChannelHash(sender: string, recipient: string, token: string, uid: string): string {
  return utils.solidityKeccak256(
    ['address', 'address', 'address', 'bytes32'],
    [sender, recipient, token || constants.AddressZero, uid],
  );
}
