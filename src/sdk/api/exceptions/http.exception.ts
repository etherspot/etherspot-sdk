import { Exception } from '../../common';
import { HttpExceptionCodes } from './constants';

export class HttpException extends Exception {
  constructor(public code: HttpExceptionCodes, message?: string) {
    super(message || code);
  }
}
