import mongoose from 'mongoose';

import { FileUpload, DownloadFile } from '../types/general.interface';
import { type ThumbnailImages, type Property, type PropertyAddress, PropertyStatus, PropertyType } from '../types/property.interface';


const AddressSchema = new mongoose.Schema<PropertyAddress>({
  street: { trim: true, type: String, minLength: 1, required: true},
  city: { trim: true, type: String, minLength: 1, required: true},
  state: { trim: true, type: String, minLength: 1, required: true},
  zipCode: { trim: true, type: String, minLength: 1, required: true},
  country: { type: String, required: true, trim: true, default: 'USA' },
})





const DownloadFileScheme = new mongoose.Schema<DownloadFile>({
  url: { type: String, trim: true, required: true},
  secureUrl: { type: String, trim: true, required: true},
  filename: { type: String, trim: true, required: true},
  mime: { type: String, trim: true, required: true},
  sizeInBytes: { type: Number,  default: 0, required: true},
  uploadedAt:{ type:Date , default: Date.now },
  uploadedBy: { type: String, trim: true, required: true}
})




const FileScheme = new mongoose.Schema<FileUpload>({
  url: { type: String, trim: true, required: true},
  secureUrl: { type: String, trim: true, required: true},
  filename: { type: String, trim: true, required: true},
  mime: { type: String, trim: true, required: true}
})


const ThumbnailSchema = new mongoose.Schema<ThumbnailImages>({
  primary: FileScheme,
  secondary: FileScheme,
  tertiary: FileScheme
})



const PropertySchema = new mongoose.Schema<Property>({
  investmentRate: { type: Number, default: 17, required: true},
  accountNo: {trim:true, type:String, unique:true, index: true, required: true},
  title: { trim: true, unique:true, type: String, minLength: 1, required: true},
  address:AddressSchema,
  investor: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  amountInvested: { type: Number, default: 0, required: true},
  completedSoFar: { type: Number, default: 0, required: true, max: 100},
  endDate: {type:Date},
  startDate: { type:Date},
  status: { trim: true, type: String, required:true, default: PropertyStatus.awaitingInspection, enum: Object.values(PropertyStatus)},
  type: { trim: true, type: String, required:true, default: PropertyType.residential, enum: Object.values(PropertyType)},
  description: {type: String, trim: true, required: true},
  createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
  imagesUrl: [FileScheme],
  legalDocumentsUrl: [DownloadFileScheme],
  inspectionReportsUrl:  [DownloadFileScheme],
  thumbnail:ThumbnailSchema
},{ timestamps: true})


PropertySchema.index({ 'address.street': 1, 'address.city': 1, 'address.state': 1, 'address.zipCode': 1 }, { unique: true });

export default mongoose.model<Property>('Property', PropertySchema);