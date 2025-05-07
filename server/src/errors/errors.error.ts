import {StatusCodes} from 'http-status-codes';
import CustomError from './customError.errors';
import { ErrorMessage } from './message.error';
import { ErrorResponse, RedirectErrorResponse } from '../types/general.interface';




export class ConnectError extends CustomError{
  readonly name = 'ConnectError';
  readonly statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  
  constructor(message = ErrorMessage.DatabaseConnectError){
    super(message)
  }
}


export class ConfigureError extends CustomError {
  readonly name = 'ConfigurationError';
  readonly statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(message = ErrorMessage.ConfigureError){
    super(message);
  }
}





export class ConflictError extends CustomError{
  readonly name = 'ConflictError';
  readonly statusCode = StatusCodes.CONFLICT
  
  constructor(message = ErrorMessage.ConflictError){
    super(message)
  }
}


export class BadRequestError extends CustomError{
  readonly name = 'BadRequestError';
  readonly statusCode = StatusCodes.BAD_REQUEST
  
  constructor(message = ErrorMessage.BadRequestError){
    super(message)
  }
}


export class RedirectError  extends CustomError{
  readonly name = 'RedirectError';
  readonly redirectUrl:string;
  readonly isFirstLogin:boolean = true
  readonly statusCode = StatusCodes.SEE_OTHER
  
  constructor(redirectUrl='/new-password', message = ErrorMessage.RedirectError){
    super(message)
    this.redirectUrl = redirectUrl;
  }


  override getErrorResponse():RedirectErrorResponse {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      redirectUrl: this.redirectUrl,
      isFirstLogin: this.isFirstLogin,
    };
  }
}



export class ForbiddenError extends CustomError{
  readonly name = 'ForbiddenError';
  readonly statusCode = StatusCodes.FORBIDDEN
  
  constructor(message = ErrorMessage.ForbiddenError){
    super(message)
  }
}


export class UnprocessableError extends CustomError{
  readonly name = 'UnprocessableError';
  readonly statusCode = StatusCodes.UNPROCESSABLE_ENTITY
  
  constructor(message = ErrorMessage.UnprocessableError){
    super(message)
  }
}




export class UnauthorizedError extends CustomError {
  readonly name = 'UnauthorizeError';
  readonly statusCode =  StatusCodes.UNAUTHORIZED;

  constructor(message = ErrorMessage.UnauthorizedError){
    super(message)
  }
}




export class PermanentlyLockedError extends CustomError {
  readonly name = 'LockedError';
  statusCode = StatusCodes.LOCKED;

  constructor(message = ErrorMessage.PermanentlyLockedError){
    super(message)
  }
}





export class TemporaryLockedError extends CustomError {
  readonly name = 'TemporaryLockedError';
  statusCode = StatusCodes.LOCKED;

  constructor(message = ErrorMessage.TemporaryLockedError){
    super(message)
  }
}




export class RouteNotFoundError extends CustomError {
  readonly name = 'RouteNotFoundError';
  statusCode = StatusCodes.NOT_FOUND;

  constructor(message = ErrorMessage.NotFoundError){
    super(message)
  }
}


export class NotFoundError extends CustomError{
  readonly name = 'NotFoundError';
  readonly statusCode = StatusCodes.NOT_FOUND
  
  constructor(message = ErrorMessage.NotFoundError){
    super(message)
  }
}




export class InternalServerError extends CustomError{
  readonly name = 'InternalServiceError';
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(message = ErrorMessage.InternalServiceError){
    super(message)

  }
}


export class EmailError extends CustomError{
  readonly name = 'EmailError';
  statusCode = StatusCodes.SERVICE_UNAVAILABLE;

  constructor(message = ErrorMessage.EmailError){
    super(message)

  }
}




