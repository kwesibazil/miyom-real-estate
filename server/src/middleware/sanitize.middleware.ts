import type { Request, Response, NextFunction } from "express";
import DOMPurify from "isomorphic-dompurify";
import { BadRequestError } from "../errors/errors.error";



const inputForbidden =  (req:Request, res:Response, next:NextFunction)=>{
  if(Object.keys(req?.query).length > 0 || Object.keys(req?.params).length > 0 || Object.keys(req?.body).length > 0)
    throw new BadRequestError('quest should not provided any params or query')
  next()
}


const cleanInput =  (req:Request, res:Response, next:NextFunction)=>{
  const target = (Object.keys(req.body).length !== 0) ? 'body' : 'params'
  req[target] = SanitizeJson(req[target])
  next()
}



const SanitizeJson = (data: any): any => {
  if (Array.isArray(data)) return data.map(SanitizeJson);
  

  if (data !== null && typeof data === 'object') {
    const clean: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        clean[key] = SanitizeJson(data[key]);
      }
    }
    return clean;
  }

  if (typeof data === 'string') {
    return DOMPurify.sanitize(data, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }

  return data;
};


export default {cleanInput, inputForbidden};