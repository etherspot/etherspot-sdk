import { BigNumber } from 'ethers';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsBigNumberish(
  options: {
    positive?: boolean;
  } = {},
  validationOptions: ValidationOptions = {},
) {
  return (object: any, propertyName: string) => {
    const { positive } = options;

    registerDecorator({
      propertyName,
      options: {
        message: `${propertyName} must be ${positive ? 'positive ' : ''}big numberish`,
        ...validationOptions,
      },
      name: 'IsBigNumberish',
      target: object.constructor,
      constraints: [],
      validator: {
        validate(value: any): boolean {
          let result = false;

          try {
            const bn = BigNumber.from(value);
            result = positive ? bn.gt(0) : bn.gte(0);
          } catch (err) {
            //
          }

          return result;
        },
      },
    });
  };
}
