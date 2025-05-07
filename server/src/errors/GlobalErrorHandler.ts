import { StatusCodes } from "http-status-codes";
import type {ErrorRequestHandler, Request, Response, NextFunction} from 'express';

import CustomError from "./customError.errors";
import { RouteNotFoundError } from "./errors.error";
import type { ErrorResponse } from "../types/general.interface";
import { User } from "../types/user.interfaces";
import logger from "../configs/logger.config";

export const GlobalCustomErrorHandler: ErrorRequestHandler = (err, req, res, next) => {  
  const user = (req.user as User | undefined) ?? {} as Partial<User>;

  const logUser = {
    id: user.id ?? 'N/A',
    email: user.email ?? 'guest',
    firstName: user.firstName ?? 'Guest',
    lastName: user.lastName ?? 'User',
  };

  const payload = {
    user: logUser,
    requestUrl: req.originalUrl,
    requestedIp: req.ip as string,
    requestMethod: req.method,
  };



  if (err instanceof CustomError) {
    const logMsg =  err.getLogMessage(payload) 
    logger.customErrorLogger.error(logMsg);

    const error: ErrorResponse = err.getErrorResponse();
    res.status(error.statusCode).json(error);
  }

  else{
    
    const error: ErrorResponse = {
      name: 'Internal Server Error',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Oops, something went wrong. Try refreshing the page or feel free to contact us if the problem persists',
    };



    const failMsg = {
      title: 'these are errors that has no error handling and somehow slip through custom class',
      name: err.name,
      message: err.message,
      stack: err.stack,
      user: logUser,
      extra: payload
    } 

    logger.customErrorLogger.error(failMsg);
    res.status(error.statusCode).json(error);
  }
};



export const RouteNotFoundErrorHandler = (req: Request, res: Response) => {
  throw new RouteNotFoundError('Route does not exist')
}
