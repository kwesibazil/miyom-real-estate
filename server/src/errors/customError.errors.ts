import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '../types/general.interface';



interface saveLogProp {
  user:{
    id:string;
    email:string;
    firstName:string;
    lastName: string;
  },
  requestedIp: string;
  requestMethod: string;
  requestUrl: string
}


export default abstract class CustomError extends Error implements ErrorResponse{
  abstract readonly name: string;
  abstract readonly statusCode: StatusCodes;


  constructor(message:string) {
    super(message);
    if (new.target === CustomError) throw new Error('Cannot instantiate abstract class');
    Object.setPrototypeOf(this, new.target.prototype);
  } 



  getLogMessage({user, requestedIp, requestMethod, requestUrl}:saveLogProp){ 
    const now = new Date(); 
    const formattedDate = now.toLocaleString();

    return JSON.stringify({
      date: formattedDate,
      name: this.name,
      message: this.message,
      url: requestUrl,
      method: requestMethod,
      status: this.statusCode,
      remoteAddress:  requestedIp,
      user: `${user.firstName} ${user.lastName} - ${user.id}`,
      summary: `${user.email} -  Encountered  ${this.name} during a ${requestMethod} to ${requestUrl} at ${formattedDate}`
    })
  }



  getErrorResponse():ErrorResponse{
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
    }
  }
}