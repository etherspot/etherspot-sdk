import { ValidationError } from './interfaces';

export class ValidationException extends Error {
  static CODE = 'VALIDATION_ERROR';

  constructor(public errors: ValidationError[]) {
    super(JSON.stringify(errors, null, 2));
  }
}
