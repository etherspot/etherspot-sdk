import { Exception } from './exception';
import { ValidationError } from './interfaces';

export class ValidationException extends Exception {
  constructor(public errors: ValidationError[]) {
    super(JSON.stringify(errors, null, 2));
  }
}
