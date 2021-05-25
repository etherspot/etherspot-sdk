export function addressesEqual(address1: string, address2: string): boolean {
  return (address1 || '').toLowerCase() === (address2 || '').toLowerCase();
}
