import { validate } from 'class-validator';
import { ValidationException } from '../../common';

export async function validateDto<T extends {}>(dto: Partial<T>, DtoConstructor: { new (): T }): Promise<T> {
  const result = new DtoConstructor();

  try {
    const dtoWithoutUndefined: {} = Object.entries(dto).reduce((result, [key, value]) => {
      if (typeof value !== 'undefined') {
        result = {
          ...result,
          [key]: value,
        };
      }
      return result;
    }, {});

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
