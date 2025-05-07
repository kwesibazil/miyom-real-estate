export interface AuthState{
  user: User | null;
  isLoggedIn: boolean;
  isFirstLogin: boolean;
  messages: Message[] | null;
  investors: Investor[] | null;
  status: 'success' | 'pending' | 'failed' | null,          
}





//compete matches controller
export interface Investor {
  _id: string;
  email:string;
  firstName:string;
  lastName:string;
  profileImgUrl: FileUpload;
  telephone?: string;
}

//compete matches controller
export interface UpdateInvestorPayload {
  investorId: string,
  updatedData: {
    email:string;
    firstName:string;
    lastName:string;
    telephone?: string;
  }
}



export interface UploadProfileImage {
  file: File;
}



export interface Message{
  _id: string
  content: string,
  subject: string,
  sent: string,
  viewed: boolean,
}


export interface FileUpload {
  url:string;
  mime:string;
  _id: string;
  secureUrl:string
  filename:string
}


//compete matches controller
export interface User {
  _id: string;
  email:string;
  passwordMustChange: boolean,
  profileImgUrl: FileUpload;
  lastName:string;
  firstName:string;
  telephone?: string;
  userRole: 'admin' | 'investor'| 'member';
}




export interface InvestorResponse {
  data: Investor[],
  message: string;   
}




export interface ServerSuccessResponse {
  name: string,
  message:string,
  statusCode?:number,
}

export interface ServerErrorResponse {
  name:string;
  message: string;
  statusCode:number;
  redirectUrl?:string;
  isFirstLogin?: boolean;
}


export interface LoginPayload {
  email: string;
  password:string;
}

export interface CreateUserPayload{
  email: string;
  firstName: string;
  lastName:string;
  telephone?:string
}


export interface UpdatePasswordPayload {
  newPassword: string;
  currentPassword:string;
}

