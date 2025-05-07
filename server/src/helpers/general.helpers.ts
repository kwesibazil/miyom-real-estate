import fs from 'fs';
import path from 'path';

import {  Types } from 'mongoose';
import { BadRequestError } from '../errors/errors.error';

import streamifier from 'streamifier';
import cloudinary from '..//configs/cloudinary.config';
import AccountModel from '../models/account.model';



export const convertStringToObjectType = async(payload:string | Types.ObjectId) => {
  try {
    const paredResult:Types.ObjectId = new Types.ObjectId(payload);
    return paredResult
  } catch (error) {
    throw new BadRequestError('Invalid format cannot convert to Types.object');
  }
}






export const uploadImageToCloudinary = async (file:Express.Multer.File):Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {folder: 'mioym-real-estate-uploads'},
      (error, result) => {
        if(error) return reject(error);
        resolve(result)
      }
    )
    streamifier.createReadStream(file.buffer).pipe(stream);
  })
}





interface generateAccountProp {
  attr: 'property' | 'investment',
  letter: string
}

export const generateSequentialAccountNo = async ({attr, letter}: generateAccountProp): Promise<string> => {
  const month =  new Date().toLocaleDateString("en-US", { month: 'short' }).toUpperCase();

  const updateField = `${attr}.sequence`;
  const monthField = `${attr}.month`;

  const account = await AccountModel.findOneAndUpdate(
    { [monthField]: month },
    {
      $set: { [monthField]: month },
      $inc: { [updateField]: 1 }
    },
    { upsert: true, new: true }
  );

  const currentSequence = attr === 'property'
    ? account.property.sequence
    : account.investment.sequence;

  const paddedSequence = String(currentSequence).padStart(3, '0');
  return `${letter}-${month}-${paddedSequence}`;
}



export const createLogDir = () => {
  const baseDir = path.join(__dirname, '../');

  const logsDir = path.join(baseDir, 'logs');
  const limiterDir = path.join(logsDir, 'limiter-logs');
  const customErrDir = path.join(logsDir, 'custom-error-logs')
  const investorDir = path.join(logsDir, 'investor-update-logs')
  
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  if (!fs.existsSync(limiterDir)) fs.mkdirSync(limiterDir, { recursive: true });
  if (!fs.existsSync(customErrDir)) fs.mkdirSync(customErrDir, { recursive: true });  
  if (!fs.existsSync(investorDir)) fs.mkdirSync(investorDir, { recursive: true });  


  return { limiterDir, customErrDir, investorDir };
}







/**
 * using the req and option draft a custom message
 * and write said message to app.limiter.log
 * 
 * @param {object} req - request object
 * @param {object} options - rate-limit object
 * @returns {JSON}  
 */
// export const savelimiterLogs = async (req, options) =>{
//   const rateLog =  JSON.stringify({
//     timeStamp: new Date(),
//     message: options.message,
//     client:{
//       ip: req.ip || req.ips || req.headers['x-forwarded-for'] || req._remoteAddress,
//       userId: req?.user?.id || 'guest user',
//       userAgent: req.headers['user-agent']
//     },
//     rateLimit:{
//       path: req.url,
//       method: req.method,
//       limit: options.limit
//     }
//   })

//   logger.limiterLogger.error(rateLog)
// }
