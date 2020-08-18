import { HttpExceptionCodes } from './constants';

export class HttpException extends Error {
  constructor(public code: HttpExceptionCodes) {
    super(code);
  }
}
