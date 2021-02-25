import { prepareAddress } from './prepare-address';

/**
 * @ignore
 */
export function prepareAddresses<T extends {}>(data: T, ...keys: (keyof T)[]): T {
  const result = {
    ...data,
  };

  for (const key of keys) {
    if (!result[key]) {
      continue;
    }

    try {
      if (Array.isArray(result[key])) {
        const addresses: any = ((result[key] as any) as string[]).map((item) => {
          let result = item;

          if (item) {
            const address = prepareAddress(item);

            if (address) {
              result = address;
            }
          }

          return result;
        });

        result[key] = addresses;
      } else {
        const address: any = prepareAddress(result[key] as any);

        if (address) {
          result[key] = address;
        }
      }
    } catch (err) {
      //
    }
  }

  return result;
}
