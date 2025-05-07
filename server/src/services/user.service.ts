
import mongoose from 'mongoose';
import CustomError from "../errors/customError.errors";

import UserModel from "../models/user.model";
import { EmailOptions  } from '../types/general.interface';
import {type User, UserRole,  UserAccountLockStatus} from "../types/user.interfaces";
import { convertStringToObjectType, uploadImageToCloudinary } from "../helpers/general.helpers";

import { TEMP_LOCK_ATTEMPTS, PERM_LOCK_ATTEMPTS} from '../configs/constants.config';
import { encryptPassword, verifyToken, sendEmailWithSendGrid, decryptPassword, generateFirstTimeRandomPassword} from "../helpers/user.helpers";
import {PermanentlyLockedError, TemporaryLockedError, ForbiddenError, NotFoundError, ConflictError, UnauthorizedError, ConfigureError, InternalServerError, BadRequestError} from "../errors/errors.error";
import { FileUpload } from '../types/general.interface';


import { checkAccountStatus } from '../helpers/user.helpers';
import { sendWelcomeEmailWithPassword } from '../helpers/property.helper';



const defaultProfileImage:FileUpload = {
  url:'https://res.cloudinary.com/dbythfvcy/image/upload/v1746503000/mioym-real-estate-uploads/sezdfgkouzgmiz6jrtzu.png',
  secureUrl:'https://res.cloudinary.com/dbythfvcy/image/upload/v1746503000/mioym-real-estate-uploads/sezdfgkouzgmiz6jrtzu.png',
  filename: 'default_avatar',
  mime: 'png'
}


/**
 * Registers a new user.
 *
 * This function performs the following steps:
 *  Extracts user data (firstName, lastName, email, telephone) from the payload.
 *  Generates a temporary password for the new user.
 *  Hashes the temporary password for secure storage.
 *  Sends a welcome email to the user containing the temporary password.
 *
 * @param payload The user data, including firstName, lastName, email, userRole, and telephone.
 * @throws {ConflictError} If a user with the provided email already exists.
 * @throws {InternalServerError} If an error occurs during registration.
 */
const register = async(payload:any) => {
  try {
    const {firstName, lastName, email, telephone} = payload;
    const tempPassword = await generateFirstTimeRandomPassword();
    const hashPassword =  await encryptPassword(tempPassword);
  
    const newUser = new UserModel({
      email, lastName, firstName,
      hashPassword, status:{},
      telephone: telephone ?? null,
      userRole: UserRole.investor,
      profileImgUrl: defaultProfileImage,
    })
    
    const user = await newUser.save();
    await sendWelcomeEmailWithPassword(email, {tempPassword, lastName, firstName});
    return user;
  } 
  catch (error:any) {
    if(error.name === 'MongoServerError' && error.code === 11000){
      if(error.keyPattern.email)
        throw new ConflictError('Registration Failed. A user with that email address already exists')
    }  
    throw new InternalServerError('Registration failed');
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Fetches up to 300 user 'investor' records from the database.
 * 
 * - Queries the `userModel` collection for all investor users.
 * - Limits the result to a maximum of 300 entries to prevent large payloads.
 * - Throws a `NotFoundError` if no investor are found.
 * 
 * @returns An array of user documents.
 * @throws NotFoundError if no user exist in the database.
 */
const findAllInvestors = async(user: User) => {
  try {
    if(user.userRole !== 'admin')throw new ForbiddenError();

    const investors = await UserModel.find({ userRole: 'investor' }).limit(300).select('-createdAt -updatedAt -__v')
    if (!investors) throw new NotFoundError('No Investors found');
    return investors;
  
  } catch (error:any) {
    if (error instanceof CustomError) throw error;
    else throw new InternalServerError();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Finds an investor by their ID, which can be a string or a Mongoose ObjectId.
 *
 * This function attempts to retrieve an investor from the database using the provided ID.
 * It first converts the ID to a Mongoose ObjectId if it's a string. It handles potential errors,
 * such as the investor not being found or a server error occurring during the database query.
 *
 * @param id The ID of the investor to find, which can be a string or a Mongoose ObjectId.
 * @returns A Promise that resolves to the investor object if found.
 * @throws {NotFoundError} If no investor is found with the given ID.
 * @throws {InternalServerError} If an unexpected error occurs during the database query.
 */
const findInvestor = async(id: string | mongoose.Types.ObjectId) => {
  try {
    const paredId = await convertStringToObjectType(id);
    const investor = await UserModel.findById(paredId)
    if (!investor) throw new NotFoundError('No Investors found');
    return investor
  } catch (error) {
    if (error instanceof CustomError) throw error;
    else throw new InternalServerError();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Updates an investor's information by their ID.
 *
 * @async
 * @function updateInvestorById
 * @param {any} payload An object containing the investorId and the updatedData.
 * @returns {Promise<any>} The updated user object.
 * @throws {NotFoundError} If the investor with the given ID is not found.
 * @throws {ConflictError} If the update fails due to a duplicate email.
 * @throws {InternalServerError} If an unexpected error occurs during the update process.
 */
const updateInvestorById = async(payload:any) => {
  try {
      const{investorId, updatedData} = payload;  
      const parsedUserId = await convertStringToObjectType(investorId);
      const user = await UserModel.findByIdAndUpdate(parsedUserId, updatedData, { new: true}) 
      if(!user) throw new NotFoundError();
      return user 
    } catch (error:any) {
      if ((error as any).code === 11000) 
        throw new ConflictError('Update Failed Investor with that email already exist');
      
      if (error instanceof CustomError) 
        throw error;
  
      throw new InternalServerError();
    }
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Updates a user's profile image.
 *
 * This asynchronous function takes an uploaded file and a user's email address as input.
 * It first attempts to find the user in the database by their email. If the user is not found,
 * it throws an `UnauthorizedError`.
 *
 * If the user is found, the function proceeds to upload the provided image file to Cloudinary
 * using the `uploadImageToCloudinary` function. If the upload fails, it throws a
 * `ConfigureError`.
 *
 * Upon successful upload, the function constructs an `FileUpload` object containing the URL,
 * secure URL, original filename, and MIME type of the uploaded image. This `FileUpload`
 * object is then assigned to the `profileImgUrl` property of the user object.
 *
 * Finally, the updated user object is saved to the database, and the saved user object is returned.
 * 
 * @param file The uploaded image file (typically from Express.Multer).
 * @param email The email address of the user whose profile image is being updated.
 * @returns A Promise that resolves to the updated user object with the new profile image URL.
 * @throws {UnauthorizedError} If no user is found with the provided email.
 * @throws {ConfigureError} If the image upload to Cloudinary fails.
 * @throws {InternalServerError} If an unexpected error occurs during database operations.
 */
const updateProfileImage = async (file:Express.Multer.File, email:string) => {
  try{
    const user: User | null = await UserModel.findOne({ email});
    if (!user) throw new UnauthorizedError('Incorrect email or password');

    const imageResult = await uploadImageToCloudinary(file);

    if (!imageResult) throw new ConfigureError('failed to upload profile image')
  
    const imageData:FileUpload = {
      url:imageResult.url,
      secureUrl: imageResult.secure_url,
      filename: file.originalname,
      mime: imageResult.format
    }

    user.profileImgUrl = imageData;
    const updatedUser =  await user.save();
    return updatedUser;
      
  } catch (error:any) {
    if (error instanceof CustomError) throw error;

    if (error?.http_code || error?.message?.includes('Cloudinary')) 
      throw new ConfigureError('Image upload failed');
    
    throw new InternalServerError();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


interface UpdatePasswordTypes{
  newPassword:string;
  currentPassword:string;
  email:string;
}

/**
 * Asynchronously updates a user's password in the database.
 *
 * This function takes an object conforming to the `UpdatePasswordTypes` interface, containing
 * the new password, the user's current password, and their email address. It performs the
 * following steps:
 *
 * 1. **Finds the user:** It attempts to locate the user in the database based on the provided email.
 * If no user is found, it throws an `UnauthorizedError` indicating incorrect credentials.
 *
 * 2. **Verifies current password:** It decrypts the stored hashed password of the found user and
 * compares it with the provided `currentPassword`. If they do not match, it throws a
 * `ForbiddenError` indicating an incorrect current password.
 *
 * 3. **Checks for password reuse:** It decrypts the stored hashed password and compares it with the
 * `newPassword`. If they match, it throws a `BadRequestError` to prevent the user from
 * using a password they've used before.
 *
 * 4. **Encrypts and updates password:** If all checks pass, it encrypts the `newPassword` and updates
 * the `hashPassword` property of the user object.
 *
 * 5. **Saves the updated user:** Finally, it saves the modified user object back to the database
 * and returns the updated user.
 *
 * The function includes error handling to catch specific custom errors (`UnauthorizedError`,
 * `ForbiddenError`, `BadRequestError`) and re-throws them. For any other unexpected errors
 * during the process, it throws a generic `InternalServerError`.
 */
const updateUserPassword = async ({newPassword, currentPassword, email}:UpdatePasswordTypes) => {
  try {

    const user: User | null = await UserModel.findOne({ email});
    if (!user) throw new UnauthorizedError('Incorrect email or password');

    const isMatch = await decryptPassword(currentPassword, user.hashPassword);


    if(user.passwordMustChange){
      const accountStatus:UserAccountLockStatus = await checkAccountStatus(user, isMatch);
      
      if(isMatch && accountStatus === UserAccountLockStatus.unlock)
        user.passwordMustChange = false


      else if(!isMatch && accountStatus === UserAccountLockStatus.unlock)
        throw new ForbiddenError('Please check your email for the correct password and try again')

      else if(accountStatus === UserAccountLockStatus.permanent)
        throw new PermanentlyLockedError()

      else if (accountStatus === UserAccountLockStatus.temporary)
        throw new TemporaryLockedError()

      else if (accountStatus === UserAccountLockStatus.incorrectPassword)
        throw new ForbiddenError('Please check your email for the correct password and try again')
    }

    if(!isMatch)
      throw new ForbiddenError('password does not match');
    
    
    const passwordsMatch = await decryptPassword(newPassword, user.hashPassword)
    if(passwordsMatch) throw new BadRequestError('Your new password matches your previous passwords. Please enter a different password');

    const newHashPassword =  await encryptPassword(newPassword);
    user.hashPassword = newHashPassword;
    return await user.save();

  } catch (error:any) {
    if (error instanceof CustomError) throw error;
    throw new InternalServerError();
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




const resetPassword = async (token: string, newPassword: string) => {
  try{
    const jwt = await verifyToken(token);
    const user: User | null = await UserModel.findOne({ email: jwt.email });

    if (!user) throw new UnauthorizedError('The password reset link is invalid or has expired.');
    
    const hashPassword =  await encryptPassword(newPassword);

    user.hashPassword = hashPassword;
    user.status.lockedUntil = new Date(0);
    user.status.isTemporaryLocked = false;
    user.status.isPermanentlyLocked = false;
    user.status.remainingAttemptsUntilTemporaryLock = TEMP_LOCK_ATTEMPTS;
    user.status.remainingAttemptsUntilPermanentLock = PERM_LOCK_ATTEMPTS;
    await user.save();

  } catch (error:any) {
    if (error instanceof CustomError) throw error;
    throw new InternalServerError();
  }
}



const sendJwtResetPasswordLink = async (recipient:string, token:string ) => {
  try {
    if (!process.env.MIOYM_EMAIL) throw new ConfigureError('sender email env is missing.');
    if (!process.env.SEND_GRID_RESET_PASSWORD_TEMPLATE_ID) throw new ConfigureError('reset email template env ID is missing.');
    if (!process.env.BASE_URL) throw new ConfigureError('base url env is missing.');

    const emailOptions:EmailOptions = {
      to: recipient,
      from: process.env.MIOYM_EMAIL,
      subject: 'MIOYM Reset Password Link',
      templateId: process.env.SEND_GRID_RESET_PASSWORD_TEMPLATE_ID,
      dynamic_template_data: {
        time: 15,
        resetLink: `${process.env.BASE_URL}reset-password?token=${token}`
      }
    } 
    await sendEmailWithSendGrid(emailOptions);

  } catch (error:any) {
    if (error instanceof CustomError) throw error;
    throw new InternalServerError();
  }
}




export default {updateProfileImage, register, findAllInvestors, findInvestor, updateInvestorById, updateUserPassword, resetPassword, sendJwtResetPasswordLink}



