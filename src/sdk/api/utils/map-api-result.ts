import { plainToClass } from 'class-transformer';

/**
 * @ignore
 */
export function mapApiResult<T extends {}, K extends keyof T>(
  data: T,
  models?: {
    [key in K]: { new (...args: any): T[K] };
  },
): T {
  const mappedData = { ...data };

  if (models) {
    const keys = Object.keys(models);

    for (const key of keys) {
      const plain = mappedData[key];
      const model = models[key];

      if (model && plain && !(plain instanceof model)) {
        mappedData[key] = plainToClass(model, plain);
      }
    }
  }

  return mappedData;
}
