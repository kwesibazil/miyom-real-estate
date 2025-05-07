import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {Types } from "mongoose";


import UserModel from "../models/user.model";
import userService from "../services/user.service";
import { generateToken } from "../helpers/user.helpers";

import {Investor, LoginResponse, User, UserAccountLockStatus } from "../types/user.interfaces";
import {RedirectError, TemporaryLockedError, UnauthorizedError, PermanentlyLockedError, InternalServerError  } from "../errors/errors.error";





const register = async (req:Request, res:Response) => {
  const user = await userService.register(req.body);

  const investor:Investor = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    _id: user._id as Types.ObjectId,
    profileImgUrl: user.profileImgUrl,
    telephone: user.telephone || ''
  }
  
  const result = {
    data: [investor],
    message: "Investor registered successfully"
  };

  res.status(StatusCodes.CREATED).json(result);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loginSuccess = async (req:Request, res:Response) => {
  const user = req.user as User;
  if (!user) throw new UnauthorizedError();

  if(user && user.passwordMustChange)
    throw new RedirectError()

  else{
    const result:LoginResponse = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userRole: user.userRole,
      _id: user._id as Types.ObjectId,
      profileImgUrl: user.profileImgUrl,
      telephone: user.telephone || '',
      passwordMustChange: user.passwordMustChange,
    }
    res.status(StatusCodes.OK).json(result)
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loginFailure = async (req:Request, res:Response) => {
  const accountStatus = req.flash('error')[0]

  if(accountStatus === UserAccountLockStatus.permanent)
    throw new PermanentlyLockedError()
  else if (accountStatus === UserAccountLockStatus.temporary)
    throw new TemporaryLockedError()
  else if (accountStatus === UserAccountLockStatus.error)
    throw new Error()
  else 
    throw new UnauthorizedError('Incorrect email or password');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const logout = async (req:Request, res:Response) => {
  if(req.session && req.user){
    req.session.destroy(err => {
      if(err){
        res.clearCookie('connect.sid', {path: '/'});
        throw new InternalServerError('failed to destroy logout session')
      }
      delete req.user;
      res.clearCookie('connect.sid', {path: '/'});
      res.status(StatusCodes.NO_CONTENT).json({})
    })
  }else{
    res.clearCookie('connect.sid', {path: '/'});
    throw new UnauthorizedError('Logout failed session expires');
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Retrieves investor data based on the user's role.
 * 
 * - If the user is an admin, fetches all investor details.
 * - Otherwise, fetches only investor associated with the user's id.
 * 
 *  @note there is currently no joi vallation to ensure investor id is sent
 * 
 * Constructs a standardized response containing:
 * - `data`: The list of properties
 * - `message`: Status message indicating success.
 */
const findInvestorsDetails =  async (req:Request, res:Response) => {
  let foundInvestor:any;

  const user = req.user as User;
  if (!user) throw new UnauthorizedError();


  if(user.userRole === 'admin')
    foundInvestor =  await userService.findAllInvestors(user);
  else{
    const investorId =  req.params.investorId || user.id 
    const result = await userService.findInvestor(investorId);
    foundInvestor = [result] 
  }

  const investors:Investor[] = foundInvestor.map((investor:User) => ({
    _id: investor._id ,
    email: investor.email,
    lastName: investor.lastName,
    firstName: investor.firstName,
    profileImgUrl: investor.profileImgUrl,
    telephone: investor.telephone || ''
  }));
    

  const result = {
    data: investors,
    message: "investor data found"
  }

  res.status(StatusCodes.OK).json(result)
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const updateInvestor = async(req:Request, res:Response) => {
  const updatedInvestor = await userService.updateInvestorById(req.body);

  const investor:Investor = {
    email: updatedInvestor.email,
    lastName: updatedInvestor.lastName,
    firstName: updatedInvestor.firstName,
    _id: updatedInvestor._id as Types.ObjectId,
    profileImgUrl: updatedInvestor.profileImgUrl,
    telephone: updatedInvestor.telephone || ''
  }

  const result = {
    data: [investor],
    message: "Investor update successfully"
  };
  res.status(StatusCodes.OK).json(result);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Handles the upload of a user's profile image to Cloudinary,
 * updates the user's profileImgUrl in the database, and returns the updated user data.
 *
 * @throws {Error} - Throws an error if no image file is provided, or
 *       if there's an error during the Cloudinary upload or database update.
 */
const uploadProfileImg = async(req:Request, res:Response) => {
  const user = req.user as User;
  
  if(!req.file) res.status(StatusCodes.BAD_REQUEST).json({message: 'no image file provided'});
  
  else{
    const updatedUser = await userService.updateProfileImage(req.file, user.email)
    
    const result:LoginResponse = {
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      userRole: updatedUser.userRole,
      _id: updatedUser._id as Types.ObjectId,
      profileImgUrl: updatedUser.profileImgUrl,
      telephone: updatedUser.telephone || '',
      passwordMustChange: updatedUser.passwordMustChange,
    }
    res.status(StatusCodes.CREATED).json(result);
  }
} 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Handles the request to update a user's password.
 *
 * This asynchronous function extracts the new and current passwords from the request body
 * and the user's email from the authenticated user object attached to the request.
 * It then calls the `updateUserPassword` service function to perform the actual password update.
 *
 * Upon successful password update, it constructs a `LoginResponse` object containing relevant
 * user information (excluding the password hash) and sends a 200 OK response with this data
 * in JSON format.
 */
const updatePassword = async(req:Request, res:Response) => {
  const user = req.user as User;
  const newPassword = req.body.newPassword
  const currentPassword = req.body.currentPassword

  const payload = {
    newPassword,
    currentPassword,
    email: user.email
  }
  
  const updatedUser = await userService.updateUserPassword(payload)

  const result:LoginResponse = {
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    userRole: updatedUser.userRole,
    _id: updatedUser._id as Types.ObjectId,
    profileImgUrl: updatedUser.profileImgUrl,
    telephone: updatedUser.telephone || '',
    passwordMustChange: updatedUser.passwordMustChange,
  }


  res.status(StatusCodes.OK).json(result);
}




const emailJwtResetPasswordLink = async (req:Request, res:Response) => {
  const user: User | null = await UserModel.findOne({ email: req.body.email });

  if(!user)
    res.status(StatusCodes.OK).json({msg:'If account exists, a password reset link has been sent to email provided.'})
  
  else{
    const jwtResetPasswordToken = await generateToken(user.email);
    await userService.sendJwtResetPasswordLink(user.email, jwtResetPasswordToken);
    


    const result = {
      name: 'forgotPassword',
      message: 'If account exists, a password reset link has been sent to email provided.'
    }

    res.status(StatusCodes.OK).json(result)
  }
}


const resetPassword = async (req:Request, res:Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader?.split(' ')[1];

  if(!token)
    throw new UnauthorizedError('Missing Token. Please enure you are using a valid link');

  await userService.resetPassword(token, req.body.password);

  const result = {
    name:'resetPassword',
    message: 'Your password has been successfully updated. You can now log in using your new password'
  }
  res.status(StatusCodes.OK).json(result)
}




export default {emailJwtResetPasswordLink, resetPassword, uploadProfileImg, register, loginFailure, loginSuccess, logout, findInvestorsDetails, updateInvestor,updatePassword}
