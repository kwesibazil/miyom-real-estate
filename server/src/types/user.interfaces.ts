import { Document, Types } from "mongoose";
import { FileUpload } from './general.interface';


export interface VerifyCallback {
  (error: Error | null, user?: Express.User | false, info?: { message: string }): void
}


export enum UserRole {
  admin = 'admin',
  member = 'member',
  investor = 'investor'
}


export enum  UserAccountLockStatus{
  error = 'error',
  unlock = 'unlock',
  permanent = 'permanent',
  temporary = 'temporary',                                     
  incorrectPassword = 'incorrectPassword',                               
}



export interface UserStatus {
  lockedUntil: Date;                                      //👈 number of milliseconds until account unlock
  isTemporaryLocked: boolean;                             //👈 temporary lock will automatically unlock after set duration or reset-link [duration define in env]
  isPermanentlyLocked: boolean;                           //👈 permanent locked can ONLY be unlocked via admin NOT reset link
  remainingAttemptsUntilTemporaryLock: number;            //👈 number of incorrect password attempts until account is temporary locked
  remainingAttemptsUntilPermanentLock: number;            //👈 number of incorrect password attempts until account is permanently locked
}


export interface IUser extends Document {
  email:string;
  firstName:string;
  lastName:string;
  telephone?:string;
  createdAt: Date;                                        //👈 add by mongoose timestamp
  updatedAt: Date;                                        //👈 add by mongoose timestamp
  userRole: UserRole;                                     //👈 admin | investor | member
  status: UserStatus;
  hashPassword: string;
  passwordMustChange: boolean;
  profileImgUrl: FileUpload;
}


export type User = IUser & Document;



export interface LoginResponse{
  _id: Types.ObjectId;
  email: string;
  profileImgUrl: FileUpload;
  firstName:string;
  lastName:string;
  telephone: string;
  passwordMustChange?: boolean;
  userRole?: 'admin' | 'investor'| 'member';
}


export interface Investor{
  _id: Types.ObjectId;
  email: string;
  profileImgUrl: FileUpload;
  firstName:string;
  lastName:string;
  telephone: string;
}





export interface SuccessResponse {
  name:string;
  message: string;
  statusCode?:number;
}

