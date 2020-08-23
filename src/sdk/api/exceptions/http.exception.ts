import { HttpExceptionCodes } from './constants';

export class HttpException extends Error {
  constructor(public code: HttpExceptionCodes, message?: string) {
    super(message || code);
  }
}
