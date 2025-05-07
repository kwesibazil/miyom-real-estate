import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError, RedirectError } from "../errors/errors.error"
import type { User} from "../types/user.interfaces";


const isLogin = (req:Request, res:Response, next:NextFunction) =>{
  const user = req.user as User;


  if(req.isAuthenticated()){
    if(req.user && !user.passwordMustChange)return next()
    else if (user)  throw new RedirectError()
    else throw new UnauthorizedError()    
  }
  
  throw new UnauthorizedError()
}



const isFirstLogin =  (req:Request, res:Response, next:NextFunction) =>{
  const user = req.user as User;

  if(req.isAuthenticated()){
    if(req.user && user.passwordMustChange)return next()
    else throw new UnauthorizedError()    
  }
  
  throw new UnauthorizedError()
}


const isAdmin = (req:Request, res:Response, next:NextFunction)  => {
  const user = req.user as User;
  if(req.user && user.userRole === 'admin') return next()
  throw new ForbiddenError()
}




export default  {isLogin, isAdmin, isFirstLogin}
