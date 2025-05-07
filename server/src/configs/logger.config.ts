import 'dotenv/config'
import morgan from 'morgan';
import winston from 'winston';
import  'winston-daily-rotate-file';

import { Request, Response } from 'express';
import { createLogDir } from '../helpers/general.helpers';
import { User } from '../types/user.interfaces';


const { combine, timestamp, align, cli, json, errors} = winston.format;
const folder = createLogDir()



export const customToken = () => {
  return (req: Request, res: Response) => {
    const user = req.user as { firstName: string; lastName: string; email: string } | undefined;
    return user ? `${user.firstName} ${user.lastName} - ${user.email}` : 'guest';
  };
};



export const customRateLimitToken = () =>{
  return (req:Request, res:Response) => {
    const user = req.user as User | undefined;
    const userAgent = req.headers['user-agent'];
    const userName = user ? `${user.firstName} ${user.lastName} - ${user.email}` : 'guest';
    return `Rate Limit exceeded for ${userName} at ${req.ip} on ${req.method} ${req.url}. ${userAgent} ${new Date().toUTCString()}`;
  }
}








const WeaklyRateLimiter = new winston.transports.DailyRotateFile({
  filename: 'app-limiter-%DATE%.log',
  datePattern: 'YYYY-MM-WW',
  zippedArchive: true,
  dirname: folder.limiterDir,
  maxSize: '30m',
  maxFiles: '61d',     //2 months
  level: 'error',
})



const MonthlyPropertyRotation = new winston.transports.DailyRotateFile({
  filename: 'app-investor-%DATE%.log',
  datePattern: 'YYYY-MM',
  zippedArchive: true,
  dirname: folder.investorDir,
  maxSize: '50m',
  maxFiles: '12M',     
  level: 'info',
})




const WeaklyCustomErrorRotation = new winston.transports.DailyRotateFile({
  filename: 'app-custom-error-%DATE%.log',
  datePattern: 'YYYY-MM-WW',
  zippedArchive: true,
  dirname: folder.customErrDir,
  maxSize: '30m',
  maxFiles: '61d',     //2 months
  level: 'error',
})




const WeaklyInternalErrorRotation = new winston.transports.DailyRotateFile({
  filename: 'needs-fixing-crash-error-%DATE%.log',
  datePattern: 'YYYY-MM-WW',
  zippedArchive: true,
  dirname: folder.customErrDir,
  maxSize: '30m',
  maxFiles: '61d',     //2 months
  level: 'info',
})



//logs every request the the app.info log and errors to app.error.log
const customErrorLogger = winston.createLogger({
  level: 'error',
  format: combine(timestamp(),json(), align(), errors({ stack: true })),
  transports:[WeaklyCustomErrorRotation]
})




//logs every request the the app.info log and errors to app.error.log
const internalServiceErrorLogger = winston.createLogger({
  level: 'error',
  format: combine(timestamp(),json(), align(), errors({ stack: true })),
  transports:[WeaklyInternalErrorRotation]
})


//logs every request the the app.info log and errors to app.error.log
const propertyLogger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(),json(), align(), errors({ stack: true })),
  transports:[MonthlyPropertyRotation]
})




//writes only rate limit the app-rate-limit.log
const limiterLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'error',
  format: combine(timestamp(),json(), align(), errors({ stack: true })),
  transports:[WeaklyRateLimiter]
})



export default {propertyLogger, customErrorLogger, limiterLogger, internalServiceErrorLogger}