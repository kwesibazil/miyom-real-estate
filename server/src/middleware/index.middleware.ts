import  sanitize from './sanitize.middleware';
import validate from '../validators/validate.joi';
import authenticate from './authentication.middleware';

import { validateParams } from '../validators/validate.joi';

import UserSchemaJoi from '../validators/UserSchema.joi';


/**
 * THESE NEEDS BETTER NAMING
 * AGAIN AM TOO TIRED TO DO THEM NOW
 * 
 * NOW THEY ARE MIDDLEWARE THAT ARE PASSED TO THE ROUTES
 * THERE IS A GLOBAL VALIDATOR THAT DYNAMICALLY APPLIES THE CORRECT SCHEMA BASED ON THE  URL/PATH
 * 
 * INSTEAD OF APPLYING THEM DIRECTLY TO THE ROUTES I CHOSE TO ABSTRACT IN AWAY IN HERE
 * 
 * 😔
 * I KNOWN I KNOW MAKES YOU RUN ALL OVER THE PLACE LOOKING FOR CODE
 * BUT I HATE SEEING TOO MUCH CODE IN ONE FILE
 */

export const userMiddleware = {
  login: [sanitize.cleanInput, validate],
  resetPassword: [sanitize.cleanInput, validate],
  forgotPassword: [sanitize.cleanInput, validate],
  
  updatePassword: [sanitize.cleanInput, validate, authenticate.isLogin],
  setPassword: [sanitize.cleanInput, validate, authenticate.isFirstLogin],
  register: [sanitize.cleanInput, validate, authenticate.isLogin, authenticate.isAdmin],
  updateInvestor: [sanitize.cleanInput, validate, authenticate.isLogin, authenticate.isAdmin],
  

  /**
   * uses a separate validator cuz something 
   * about typescript is not matching the path 
   * don't have time to debug that so it gets its own validator
   * this validator is also shared with two routes in property
   */
  getAllInvestor: [authenticate.isLogin, validateParams(UserSchemaJoi.investorIdParamsSchema)],

  /**
   * am not validating the file uploaded
   * this routes only accepts the file internally it uses the 
   * user values in session to get user email/id necessary for uploads
   */
  uploadProfileImg: [authenticate.isLogin],   
}
  



export const propertyMiddleware = {   
  findAll: [authenticate.isLogin, authenticate.isAdmin],                                
  update: [sanitize.cleanInput, validate, authenticate.isLogin, authenticate.isAdmin],
  create: [sanitize.cleanInput, validate, authenticate.isLogin,  authenticate.isAdmin],
  

  searchId: [authenticate.isLogin, validateParams(UserSchemaJoi.propertyIdParamsSchema), authenticate.isAdmin],                                 //needs valuation function has the schema
  searchTitle: [authenticate.isLogin,  validateParams(UserSchemaJoi.propertyTitleParamsSchema), authenticate.isAdmin],                              //needs valuation function has the schema

  /**
   * uses a separate validator cuz something 
   * about typescript is not matching the path 
   * don't have time to debug that so it gets its own validator
   * this validator is also used by two routes property (😔fix them later am too lazy to do it now)
   */
  findAllProperties: [authenticate.isLogin, validateParams(UserSchemaJoi.investorIdParamsSchema)],                                                   //needs valuation function has the schema
  
  /**
   * am not validating the file uploaded
   * however the other properties are validated inside the controller itself 
   */
  upload: [authenticate.isLogin, authenticate.isAdmin],
}


