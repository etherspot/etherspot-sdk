import { utils } from 'ethers';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsBytesLike(options: ValidationOptions & { acceptText?: boolean } = {}) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      propertyName,
      options: {
        message: `${propertyName} must be bytes like`,
        ...options,
      },
      name: 'IsBytesLike',
      target: object.constructor,
      constraints: [],
      validator: {
        validate(value: any): boolean {
          let result = false;

          try {
            if (value) {
              switch (typeof value) {
                case 'string':
                  if (options.acceptText) {
                    result = true;
                  } else {
                    result = utils.isHexString(value) && value.length % 2 === 0;
                  }
                  break;

                case 'object':
                  result = Array.isArray(value) && value.every((value) => typeof value === 'number');
                  break;
              }
            }
          } catch (err) {
            //
          }

          return result;
        },
      },
    });
  };
}
