import { validate } from 'class-validator';
import { ValidationException } from '../../common';

export async function validateDto<T extends {}>(dto: Partial<T>, DtoConstructor: { new (): T }): Promise<T> {
  const result = new DtoConstructor();

  Object.assign(result, dto);

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
