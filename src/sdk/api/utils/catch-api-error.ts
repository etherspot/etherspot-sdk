import { ApolloError } from '@apollo/client/core';
import { ValidationException } from '../../common';
import { HttpExceptionCodes, HttpException } from '../exceptions';

/**
 * @ignore
 */
export function catchApiError(error: ApolloError): void {
  let exception: Error;

  try {
    const { code, errors } = error.graphQLErrors[0].extensions as {
      code: string;
      errors: any;
    };

    switch (code) {
      case HttpExceptionCodes.BadRequest:
      case HttpExceptionCodes.Unauthorized:
      case HttpExceptionCodes.Forbidden:
      case HttpExceptionCodes.NotFound:
        exception = new HttpException(code);
        break;

      case HttpExceptionCodes.InternalServerError:
        exception = new HttpException(code, error.message);
        break;

      case HttpExceptionCodes.ValidationError:
        exception = new ValidationException(errors);
        break;
    }
  } catch (err) {
    //
  }

  if (!exception) {
    exception = error;
  }

  throw exception;
}
