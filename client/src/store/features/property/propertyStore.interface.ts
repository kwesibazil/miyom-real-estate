
import { FileUpload } from '../auth/authStore.interface';




export interface PropertyState{
  properties: Property[] | null;
  status: 'idle' | 'pending' | 'success' | 'failed' | null;
}


export interface Property {
  _id: any | string;
  endDate?: Date | null; 
  title: string;
  startDate?: Date | null;
  updatedAt: Date;
  createdAt:Date;
  investmentRate: number;
  investor: PropertyInvestor;
  accountNo: string;
  type: PropertyType;
  description: string;
  amountInvested: number;
  completedSoFar: number;
  status: PropertyStatus;
  address: PropertyAddress;
  createdBy: any | string;
  thumbnail?: ThumbnailImages;
  imagesUrl?: FileUpload[] | null; 
  legalDocumentsUrl?: DownloadFile[] | null; 
  inspectionReportsUrl?: DownloadFile[] | null; 
}




export interface PropertyResponse {
  data: Property[],
  message: string;   
}





export interface CreatePropertyPayload {
  type: PropertyType;
  status: PropertyStatus;
  address:PropertyAddress, 
  amountInvested: number;
  completedSoFar: number;
  startDate?: string, 
  endDate?: string,  
  investmentRate: number;
  description?:string,  
  investorId: string;
}




export interface UpdatePropertyPayload {
  propertyId: any | string;
  updatedData: {
    endDate?: string;
    startDate?:string;
    type?: PropertyType;
    amountInvested?: number;
    completedSoFar?: number;
    investor: string;
    investmentRate: number;
    status?: PropertyStatus;
    address?: PropertyAddress;
  }
}



export interface UploadPropertyFileInput {
  files: File[];
  propertyId: string;
  thumbnail?: string;
  uploadType: "image" | "legal" | 'inspection'
}



export interface PropertyAddress{
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}



export interface ThumbnailImages{
primary:FileUpload;
secondary?:FileUpload;
tertiary?: FileUpload;
fourth?: FileUpload ;
}



export interface PropertyForm  {
  endDate?: Date | null;
  title: string;
  startDate?: Date | null;
  type: PropertyType;
  description?: string;
  amountInvested: number;
  completedSoFar: number;
  status: PropertyStatus;
  address: PropertyAddress;
}

export interface DownloadFile{
  url:string;
  mime:string;
  secureUrl:string
  filename:string
  sizeInBytes: number;
  uploadedAt: string;
  uploadedBy: string;
}






export interface InvestorTier {
  email: string;
  amount: number;
}

export interface InvestorTiers {
  gold: InvestorTier[];
  silver: InvestorTier[];
  copper: InvestorTier[];
}



export interface PropertyInvestor{
  _id: string;
  email: string;
  profileImgUrl: FileUpload;
  firstName:string;
  lastName:string;
  telephone?: string
}




export enum  PropertyType{
  industrial = 'industrial',                                   
  commercial = 'commercial',
  residential = 'residential',                                     
}


export enum  PropertyStatus{
  completed = 'completed',                                     
  underConstruction= 'under construction',
  awaitingInspection = 'awaiting inspection'                                  
}

