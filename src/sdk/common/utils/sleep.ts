/**
 * @ignore
 */
export function sleep(sec: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, sec * 1000));
}
