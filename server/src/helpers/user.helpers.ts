import bcrypt from 'bcryptjs'
import sgMail from '@sendgrid/mail'
import jwt, {type JwtPayload } from 'jsonwebtoken';

import { EmailOptions} from '../types/general.interface';
import { User, UserAccountLockStatus } from '../types/user.interfaces';

import {ConfigureError, UnauthorizedError, EmailError } from '../errors/errors.error';
import {TEMP_LOCK_MINUTES, TEMP_LOCK_ATTEMPTS, PERM_LOCK_ATTEMPTS } from '../configs/constants.config';



export async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}


export async function decryptPassword(password:string, hash:string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}






export const checkAccountStatus = async (user: User, passwordMatch: boolean): Promise<UserAccountLockStatus> => {
  try {
    const status = user.status;
    const now = new Date();

    // Handle permanent lock
    if (status.isPermanentlyLocked) {
      return UserAccountLockStatus.permanent;
    }

    // Handle temporary lock
    if (status.isTemporaryLocked) {
      if (now < new Date(status.lockedUntil)) {
        return UserAccountLockStatus.temporary;
      } else {
        // Unlock if lock timeout has passed
        status.isTemporaryLocked = false;
        status.lockedUntil = new Date(0);
        status.remainingAttemptsUntilTemporaryLock = TEMP_LOCK_ATTEMPTS;
        await user.save();
        return UserAccountLockStatus.unlock;
      }
    }


    // If password is correct and account not locked
    if (passwordMatch) {
      status.isTemporaryLocked = false;
      status.isPermanentlyLocked = false;
      status.remainingAttemptsUntilTemporaryLock = TEMP_LOCK_ATTEMPTS;
      status.remainingAttemptsUntilPermanentLock = PERM_LOCK_ATTEMPTS;
      await user.save();
      return UserAccountLockStatus.unlock;
    }


    // Password incorrect, handle attempt reduction
    status.remainingAttemptsUntilTemporaryLock--;
    status.remainingAttemptsUntilPermanentLock--;


    // Apply temporary lock if limit reached
    if (status.remainingAttemptsUntilTemporaryLock <= 0) {
      status.isTemporaryLocked = true;
      status.lockedUntil = new Date(now.getTime() + TEMP_LOCK_MINUTES  * 60 * 1000);
      await user.save();
      return UserAccountLockStatus.temporary;
    }
  

    // Apply permanent lock if limit reached CAN ONLY BE UNLOCK BY ADMIN OR RESET PASSWORD
    if (status.remainingAttemptsUntilPermanentLock <= 0) {
      status.isPermanentlyLocked = true;
      await user.save();
      return UserAccountLockStatus.permanent;
    }

    // Save reduced attempts
    await user.save();
    return UserAccountLockStatus.incorrectPassword;

  } catch (err) {
    console.error('Error in checkAccountStatus:', err);
    return UserAccountLockStatus.error;
  }
};




export const generateToken =  async (email:string) => {
  if (!process.env.JWT_SECRET) 
    throw new ConfigureError('JWT_SECRET env is missing.');

  const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '45m',  algorithm: 'HS256'})

  if(!token)
    throw new EmailError(`We encountered an error while sending reset-link. Please try again or contact our support if the issue continues`);
    
  return token;
}




export const verifyToken = async (token: string): Promise<JwtPayload> => {
  try {

    if (!process.env.JWT_SECRET)
      throw new ConfigureError('JWT_SECRET env is missing.');

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    if (typeof decoded === 'string' || !decoded.email) 
      throw new UnauthorizedError('The password reset link is invalid or has expired.');
    
    return decoded as JwtPayload;
  } catch (error) {
    throw new UnauthorizedError('The password reset link is invalid or has expired.');
  }
};




export const sendEmailWithSendGrid = async (emailOptions:EmailOptions) => {
  try {
    if (!process.env.SEND_GRID_API_KEY) 
      throw new ConfigureError('sendgrid api key env is missing.');

    sgMail.setApiKey(process.env.SEND_GRID_API_KEY); 
    return await sgMail.send(emailOptions); 
  } catch (error) {
    throw new EmailError(`We encountered an error while sending reset-link. Please try again or contact our support if the issue continues`);
  }
}



export const generateFirstTimeRandomPassword = async(): Promise<string> => {

    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const allChars = lowercase + uppercase + numbers;
    
    const getRandom = (str: string) => str[Math.floor(Math.random() * str.length)];
  
    let password = [
      getRandom(lowercase),
      getRandom(uppercase),
      getRandom(numbers),
    ];
  
    const desiredLength = Math.floor(Math.random() * (10 - 8 + 1)) + 8; 
  
    while (password.length < desiredLength) {
      password.push(getRandom(allChars));
    }
  
    password = password.sort(() => 0.5 - Math.random());
    return password.join('');
  }
