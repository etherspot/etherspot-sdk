import { Exception } from './exception';
import { ValidationError } from './interfaces';

export class ValidationException extends Exception {
  static throw(property: string, constraints: { [key: string]: string }) {
    const validationError: ValidationError = {
      property,
      constraints,
    };

    throw new ValidationException([validationError]);
  }

  constructor(public errors: ValidationError[]) {
    super(JSON.stringify(errors, null, 2));
  }
}
