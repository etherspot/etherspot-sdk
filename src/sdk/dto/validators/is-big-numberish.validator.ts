import { BigNumber } from 'ethers';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsBigNumberish(options: ValidationOptions = {}) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      propertyName,
      options: {
        message: `${propertyName} must be big numberish`,
        ...options,
      },
      name: 'IsBigNumberish',
      target: object.constructor,
      constraints: [],
      validator: {
        validate(value: any): boolean {
          let result = false;

          try {
            const bn = BigNumber.from(value);
            result = bn.gt(0);
          } catch (err) {
            //
          }

          return result;
        },
      },
    });
  };
}
