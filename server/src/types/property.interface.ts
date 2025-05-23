import { Types, Document } from 'mongoose';
import { FileUpload } from './general.interface';

import { Investor } from './user.interfaces';




export interface IProperty{
  _id:Types.ObjectId;
  title: string;                                        //👈 auto generated by helper function
  createdAt: Date;                                      //👈 add by mongoose timestamp
  updatedAt: Date;                                      //👈 add by mongoose timestamp
  accountNo: string;                                    //👈 auto generated by helper function
  endDate?: Date;                                       //👈 optional
  startDate?: Date;                                     //👈 optional
  type: PropertyType;                                   //👈 default to residential for now
  description: string;
  amountInvested: number;                     
  completedSoFar: number;
  status: PropertyStatus;
  address: PropertyAddress;
  investmentRate: number;
  createdBy:Types.ObjectId;
  investor: Types.ObjectId;                          //👈 reference to user collection -- populated afterwards as a investor type
  thumbnail?: ThumbnailImages;
  imagesUrl?: FileUpload[];                            //👈 array of urls
  legalDocumentsUrl?: FileUpload[];                    //👈 array of urls
  inspectionReportsUrl?: FileUpload[]                  //👈 array of urls
}


export type Property = IProperty & Document;           //👈 DATABASE MODEL -> THIS IS WHAT IS RETURN FORM MONGO/MONGOOSE



/**
 * THIS IS WHAT IS RETURN TO FRONTEND
 */
export interface PropertyResponseObj{
  _id:Types.ObjectId;
  title: string;
  endDate?: Date;
  accountNo: string;   
  startDate?: Date;
  type: PropertyType;
  description: string;
  amountInvested: number;
  completedSoFar: number;
  status: PropertyStatus;
  address: PropertyAddress;
  investmentRate: number;
  investor: Investor;
  thumbnail?: ThumbnailImages;
  imagesUrl?: FileUpload[];
  legalDocumentsUrl?: FileUpload[];
  inspectionReportsUrl?: FileUpload[];
}

/**
 * THIS IS WHAT IS RETURN TO FRONTEND
 */
export interface PropertyResponse {
  message: string;
  data: PropertyResponseObj | PropertyResponseObj[],
}



export interface CreateProperty {
  type: string;
  status: string;
  endDate: string;
  investorId:string;
  startDate: string;
  address:PropertyAddress;
  amountInvested: number;
  completedSoFar: number;
  description?: string;
  investmentRate: number;
}


export interface UploadPropertyFile {
  propertyId: string;
  type: 'image' | 'legal' | 'inspection',
  thumbnail?:  'primary' | 'secondary' | 'tertiary' | 'fourth';
}




export enum  PropertyType {
  industrial = 'industrial',                                   
  commercial = 'commercial',
  residential = 'residential',                                     
}


export enum  PropertyStatus{
  completed = 'completed',                                     
  construction= 'under construction',
  awaitingInspection = 'awaiting inspection'                                  
}


export interface PropertyAddress {
  city: string;
  state: string;
  street: string;
  zipCode: string;
  country: string;
}




export interface ThumbnailImages{
  primary?:FileUpload;
  secondary?:FileUpload;
  tertiary?: FileUpload;
  fourth?: FileUpload ;
}




