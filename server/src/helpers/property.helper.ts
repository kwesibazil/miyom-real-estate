import UserModel from "../models/user.model";
import CustomError from "../errors/customError.errors";
import {sendEmailWithSendGrid} from "../helpers/user.helpers";
import {ConfigureError, InternalServerError} from "../errors/errors.error";

import { CreateProperty, Property} from '../types/property.interface';
import { EmailOptions ,dynamicTemplateData } from '../types/general.interface';


export const generateDescription = (property:CreateProperty | Property) => {
  const {
    endDate,startDate,
    type,status, address,
    amountInvested, completedSoFar,
  } = property;

  const addressString = `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`;
  let generateDesc = `The ${type} property, located at ${addressString}, is currently ${status}. `;

  if (startDate !== "N/A" && endDate !== "N/A") {
    generateDesc += `The project started on ${startDate} and is expected to be completed by ${endDate}. `;
  } else if (startDate !== "N/A") {
    generateDesc += `The project started on ${startDate}. `;
  } else if (endDate !== "N/A") {
    generateDesc += `The project is expected to be completed by ${endDate}. `;
  }

  generateDesc += `The amount invested is $${amountInvested}, and it is ${completedSoFar}% completed. `;
  return {generateDesc, addressString }
}




export const sendWelcomeEmailWithPassword = async(recipient:string, payload:dynamicTemplateData) => {
  try {
    if (!process.env.MIOYM_EMAIL) throw new ConfigureError('sender email env is missing.');
    if (!process.env.SEND_GRID_WELCOME_PASSWORD_TEMPLATE_ID) throw new ConfigureError('welcome email template env ID is missing.');
    if (!process.env.BASE_URL) throw new ConfigureError('base url env is missing.');
    
    const emailOptions:EmailOptions = {
      to: recipient,
      from: process.env.MIOYM_EMAIL,
      subject: 'MIOYM Reset Password Link',
      templateId: process.env.SEND_GRID_WELCOME_PASSWORD_TEMPLATE_ID,
      dynamic_template_data: {
        tempPassword: payload.tempPassword,
        lastName: payload.lastName,
        firstName: payload.firstName,
        days: 7,
        supportEmail: process.env.MIOYM_EMAIL,
        newPasswordLink:`${process.env.BASE_URL}new-password`
      }
    }
  
    await sendEmailWithSendGrid(emailOptions);

  } catch (error:any) {
    if (error instanceof CustomError) throw error;
    throw new InternalServerError();
  }
}
