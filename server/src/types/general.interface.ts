
import {ObjectSchema} from 'joi'
import {type StatusCodes} from 'http-status-codes';


import { Request } from 'express';
import { ThumbnailImages } from './property.interface';

import { Types } from 'mongoose';

export interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}



export interface ErrorResponse {
  name: string;
  message: string;
  statusCode: StatusCodes;
}

export interface RedirectErrorResponse extends ErrorResponse {
  isFirstLogin: boolean;
  redirectUrl: string;
}





export interface UserResponse {
  _id: Types.ObjectId;
  email: string;
  profileImgUrl: FileUpload;
  firstName:string;
  lastName:string;
  userRole: 'admin' | 'investor'| 'member';
}



export interface FileUpload {
  url:string
  secureUrl:string;
  filename:string;
  mime:string;
}

export interface DownloadFile{
  url:string;
  mime:string;
  secureUrl:string
  filename:string
  sizeInBytes: number;
  uploadedAt: string | Date;
  uploadedBy: string;
}



export interface CounterModelType {
  month: string;
  sequence: number;
}

export interface AccountModelType {
  property: CounterModelType,
  investment: CounterModelType
}

export interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  templateId: string;
  dynamic_template_data: dynamicTemplateData
}






export interface dynamicTemplateData {
    days?: number;
    time?: number;
    lastName?: string;
    firstName?: string;
    resetLink?: string;
    tempPassword?:string
    supportEmail?: string;
    newPasswordLink?:string;
}





export interface ValidationSchemas {
  POST?:{
    [key:string] : ObjectSchema
  },
  GET?:{
    [key:string] : ObjectSchema
  },
  PUT?:{
    [key:string] : ObjectSchema
  },
  DELETE?:{
    [key:string] : ObjectSchema
  },
}


export interface UploadResource{
  data: FileUpload[];
  id: string;
  type: string;
  thumbnail?:  'primary' | 'secondary' | 'tertiary' | 'fourth';
}




export interface SetThumbnailOptions {
  images: FileUpload[];
  existingThumbnails: ThumbnailImages | null;
  overrideType?: 'primary' | 'secondary' | 'tertiary' | 'fourth';
  overrideImage: FileUpload;
}