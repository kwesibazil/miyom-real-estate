import mongoose from 'mongoose';
import { User, UserStatus, UserRole } from '../types/user.interfaces';
import { TEMP_LOCK_ATTEMPTS, PERM_LOCK_ATTEMPTS } from '../configs/constants.config';

import { FileUpload } from '../types/general.interface';
import { required } from 'joi';


const StatusSchema = new mongoose.Schema<UserStatus>({
  lockedUntil:{ type:Date, default: new Date(0), required: true},
  isTemporaryLocked: { type: Boolean, default: false, required: true},
  isPermanentlyLocked: { type: Boolean, default: false, required: true},
  remainingAttemptsUntilTemporaryLock:{ type: Number, default: 5, required: true, max: TEMP_LOCK_ATTEMPTS},
  remainingAttemptsUntilPermanentLock:{ type: Number, default: 10, required: true, max: PERM_LOCK_ATTEMPTS}
})



const FileScheme = new mongoose.Schema<FileUpload>({
  url: { type: String, trim: true, required: true},
  secureUrl: { type: String, trim: true, required: true},
  filename: { type: String, trim: true, required: true},
  mime: { type: String, trim: true, required: true}
})



const UserSchema = new mongoose.Schema<User>({
  firstName: {trim: true,  type: String, required: true},
  lastName: {trim: true,  type: String, required: true},
  email: { trim: true, index: true, type: String, unique: true, required: true},                                  //👈 index && unique
  hashPassword:{ trim: true, type: String, minLength: 8, required: true},
  telephone: {trim: true,  type: String, max: 18},
  userRole: { trim: true, type: String, required:true, default: UserRole.investor, enum: Object.values(UserRole)},       //👈 enum validation expects an array of allowed values, not an object hence Object.values
  status: { type: StatusSchema, required: true},
  passwordMustChange: {type: Boolean, required:true, default:true },
  profileImgUrl: FileScheme,
},{ timestamps: true})



export default mongoose.model<User>('User', UserSchema);