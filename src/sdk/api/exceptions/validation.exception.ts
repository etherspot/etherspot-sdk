import { HttpExceptionCodes } from './constants';
import { HttpException } from './http.exception';
import { ValidationError } from './interfaces';

export class ValidationException extends HttpException {
  constructor(public errors: ValidationError[]) {
    super(HttpExceptionCodes.ValidationError, JSON.stringify(errors, null, 2));
  }
}
