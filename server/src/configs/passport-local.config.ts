import passport from "passport";
import { Request } from "express";
import { Strategy as LocalStrategy, type IStrategyOptionsWithRequest } from 'passport-local';

import UserModel from "../models/user.model"
import { type User, VerifyCallback, UserAccountLockStatus} from "../types/user.interfaces";
import { decryptPassword, checkAccountStatus} from "../helpers/user.helpers";


//local strategy 
const customFields:IStrategyOptionsWithRequest = {
  passwordField: 'password',
  usernameField: 'email',
  passReqToCallback: true
}



/**
 * @param {String} email - user email
 * @param {String} password - user password
 * @param {func} done - callback function 
 * @summary
 *    validates the user using the email and password provided
 *    if successful, attaches a passport property to the req.session object 
 *    If fail at any step, returns null, false and an err msg 
 */


const localVerify = async (req: Request, email: string, password: string, done: VerifyCallback) => {
  try {
    const user = await UserModel.findOne({email});
    if (!user)                                                        //👈 email incorrect
      return done(null, false, { message: UserAccountLockStatus.incorrectPassword });

    const isMatch = await decryptPassword(password, user.hashPassword);
    const accountStatus:UserAccountLockStatus = await checkAccountStatus(user, isMatch);
    
    return (isMatch && accountStatus === 'unlock')
      ? done(null, user, { message: accountStatus })            //👈 feedback message is passed to success controller
      : done(null, false, { message: accountStatus })           //👈 feedback message is passed to failure controller

  } catch (error) {
    return done(null, false, { message: UserAccountLockStatus.error });
  }
};




/**
 * @name LocalStrategy
 * @param {object} customFields - overrides LocalStrategy  username and password fields
 * @param {Func}  localVerify - callback function that verify email and password
 * @desc  - called when the `passport.authenticate()`in auth/login route is run.
 *          authenticate and authorization user using session and cookies
 */
const passportLocal =  new LocalStrategy(customFields, localVerify);



/**
 * This function is used in conjunction with by the `passport.authenticate()` method defined on the registration route 
 * It is called by the internal passport function defined as callback function in the above ^^ passport.use(new LocalStrategy) function
 * Serializing a user determines which data of the user object should be stored in the session, in ths case the user id. 
 * When we serialize a user, Passport takes that user id and stores it internally on req.session.passport 
 */
passport.serializeUser((user: Express.User, done:VerifyCallback) => {
  done(null, (user as User).email);
})





/**
 * This function is used in conjunction with the `server.use(passport.session())` middleware
 * The deserializeUser() function uses the id to look up the User by the given ID in the database and return it
 */
passport.deserializeUser(async (email:string, done:VerifyCallback) => {
  try {
    const user = await UserModel.findOne({email});

    (!user) 
      ? done(null, false, { message: UserAccountLockStatus.incorrectPassword }) 
      : done(null, user, { message: UserAccountLockStatus.unlock })
    
  } catch (error) {
    done(null, false, { message: UserAccountLockStatus.error });
  }
})


export default passportLocal;