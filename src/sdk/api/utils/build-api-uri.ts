import { ApiOptions } from '../interfaces';

export function buildApiUri(options: ApiOptions, protocol: string, path = ''): string {
  const { useSsl, host, port } = options;

  return `${protocol}${useSsl ? 's' : ''}://${host}${port ? `:${port}` : ''}${path}`;
}
