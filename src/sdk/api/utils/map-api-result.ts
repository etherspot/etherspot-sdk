import { plainToClass } from 'class-transformer';

export function mapApiResult<T extends {}, K extends keyof T>(
  data: T,
  models?: {
    [key in K]: { new (...args: any): T[K] };
  },
): T {
  if (models) {
    const keys = Object.keys(models);

    for (const key of keys) {
      if (models[key]) {
        data[key] = plainToClass(models[key], data[key]);
      }
    }
  }

  return data;
}
