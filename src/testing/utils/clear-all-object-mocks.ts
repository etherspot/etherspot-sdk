/**
 * @ignore
 */
export function clearAllObjectMocks(...objs: any[]): void {
  for (const obj of objs) {
    if (obj && typeof obj === 'object') {
      const keys = Object.keys(obj);

      for (const key of keys) {
        try {
          if (obj[key].mockClear) {
            obj[key].mockClear();
          }
        } catch (err) {
          //
        }
      }
    }
  }
}
