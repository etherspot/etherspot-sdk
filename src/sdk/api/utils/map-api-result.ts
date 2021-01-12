import { plainToClass } from 'class-transformer';

export function mapApiResult<T extends {}, K extends keyof T>(
  data: T,
  models?: {
    [key in K]: { new (...args: any): T[K] };
  },
): T {
  console.log(data);
  if (models) {
    const keys = Object.keys(models);

    for (const key of keys) {
      const plain = data[key];
      const model = models[key];

      if (model && plain && !(plain instanceof model)) {
        data[key] = plainToClass(models[key], data[key]);
      }
    }
  }

  return data;
}
