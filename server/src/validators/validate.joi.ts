import { ObjectSchema } from 'joi';


import { Request, Response, NextFunction } from 'express';
import { UnprocessableError, InternalServerError} from '../errors/errors.error';

import UserSchemaJoi from './UserSchema.joi';
import PropertySchemaJoi from './PropertySchema.joi';
import { ValidationSchemas } from '../types/general.interface';


const schemas: ValidationSchemas = {
  POST: {
    '/api/user/login': UserSchemaJoi.loginUserSchema,
    '/api/user/set-password': UserSchemaJoi.updatePassword,
    '/api/user/register': UserSchemaJoi.registerUserSchema,
    '/api/user/reset-password': UserSchemaJoi.resetPasswordSchema,
    '/api/user/forgot-password': UserSchemaJoi.forgotPasswordSchema,
    '/api/property/create': PropertySchemaJoi.createPropertySchema
  },
  GET: {
    '/api/property/id': PropertySchemaJoi.searchByIdSchema,
    '/api/property/search': PropertySchemaJoi.searchByStringSchema,
  },
  PUT: {
    '/api/user/update': UserSchemaJoi.UpdateInvestorSchema, 
    '/api/property/update': PropertySchemaJoi.UpdatePropertySchema,
    '/api/user/update-password': UserSchemaJoi.updatePassword,
  }
}



const validate = (req:Request, res:Response, next: NextFunction) => {
  const url = req.originalUrl
  const key: 'body' | 'params' = (Object.keys(req.body || {}).length !== 0) ? 'body' : 'params';          //👈 determines where payload was sent via body || params
  const schema = schemas[req.method as keyof ValidationSchemas]?.[url];                                //👈 dynamically attach the correct schema base
  const dataToValidate = req[key];
  if (!schema) throw new InternalServerError('no joi schema found')
  const { error } = schema.validate(dataToValidate, { abortEarly: true }); 
  if (error) throw new UnprocessableError(error.message);
  next()  
}



export const validateParams = (schema: ObjectSchema) => { 
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params, { abortEarly: true });
    if (error) throw new UnprocessableError(error.message); 
    next();
  };
};









export default validate;