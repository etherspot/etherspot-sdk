/**
 * @ignore
 */
export function createSessionMessage(code: string): string {
  return [
    'ETHERspot Authentication 😎 ', //
    '',
    code,
    '',
    `it will expire in less than 30 seconds`,
  ].join('\n');
}
