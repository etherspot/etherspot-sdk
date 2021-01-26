/**
 * @ignore
 */
export function mockService(mocked: {}): unknown {
  return jest.fn().mockImplementation(() => ({
    ...mocked,
    init: jest.fn(),
    destroy: jest.fn(),
  }));
}
