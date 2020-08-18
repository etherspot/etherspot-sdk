import { ApolloError } from '@apollo/client/core';
import { HttpExceptionCodes, HttpException, ValidationException } from '../exceptions';

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
      case HttpExceptionCodes.InternalServerError:
        exception = new HttpException(code);
        break;

      case ValidationException.CODE:
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
