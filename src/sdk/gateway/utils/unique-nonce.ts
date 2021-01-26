let currentNonce = Math.floor(Date.now() / 1000) - 1605000000;

/**
 * @ignore
 */
export function uniqueNonce(): number {
  currentNonce += 1;
  return currentNonce;
}
