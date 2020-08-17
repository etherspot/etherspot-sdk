/**
 * @ignore
 */
export function concatHex(...hex: string[]): string {
  return hex.map((item, index) => (index ? item.slice(2) : item)).join('');
}
