import { validate } from 'class-validator';
import { ValidationException, prepareAddresses } from '../../common';

/**
 * @ignore
 */
export async function validateDto<T extends {}>(
  dto: Partial<T>,
  DtoConstructor: { new (): T },
  options: {
    addressKeys?: (keyof T)[];
  } = {},
): Promise<T> {
  const result = new DtoConstructor();

  const { addressKeys } = options;

  try {
    let dtoWithoutUndefined = Object.entries(dto).reduce((result, [key, value]) => {
      if (typeof value !== 'undefined') {
        result = {
          ...result,
          [key]: value,
        };
      }
      return result;
    }, {}) as T;

    if (addressKeys) {
      dtoWithoutUndefined = prepareAddresses(dtoWithoutUndefined, ...addressKeys);
    }

    Object.assign(result, dtoWithoutUndefined);
  } catch (err) {
    //
  }

  const errors = await validate(result, {
    forbidUnknownValues: true,
    validationError: {
      target: false,
      value: false,
    },
  });

  if (errors && errors.length) {
    throw new ValidationException(errors);
  }

  return result;
}
