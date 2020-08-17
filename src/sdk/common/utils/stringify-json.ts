/**
 * @ignore
 */
export function stringifyJson<T>(value: T, space?: number): string {
  return JSON.stringify(value, null, space);
}
