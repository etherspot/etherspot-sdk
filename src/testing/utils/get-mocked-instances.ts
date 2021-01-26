/**
 * @ignore
 */
export function getMockedInstances<T extends {}>(
  instances: T,
): {
  [key in keyof T]: jest.Mocked<T[key]>;
} {
  return instances as any;
}
