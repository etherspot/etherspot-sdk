/**
 * @ignore
 */
export function parseJson<T>(raw: string, defaultValue: T = null): T {
  let result: T;
  try {
    result = JSON.parse(raw);
  } catch (err) {
    result = defaultValue;
  }

  return result;
}
