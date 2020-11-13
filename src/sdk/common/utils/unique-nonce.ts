let currentNonce = Math.floor(Date.now() / 1000) - 1605000000;

export function uniqueNonce(): number {
  currentNonce += 1;
  return currentNonce;
}
