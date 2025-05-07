import { Middleware,  AnyAction } from '@reduxjs/toolkit';
import router from '../router/router'


import { updateFirstLogin } from './features/auth/AuthSlice.store';


const getErrorPath = (statusCode:number|undefined) => {
	switch(statusCode){
		case 500: return '/error/internal-server-error'
		case 401: return '/error/unauthorize-access'
    case 303: return '/new-password'
		default: return '/error/internal-server-error'
	}
}



/**
 * Redux middleware to handle errors, 
 * 
 * @note --
 * redirect users to /new-password when its there first time login.
 *
 */
export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  const typedAction = action as AnyAction;


  
  if (typedAction.type.endsWith('/rejected')) {
    const statusCode = typedAction.payload?.statusCode as number | undefined;
    const name = typedAction.payload?.name;
    const isFirstLogin = typedAction.payload?.isFirstLogin

  
    // const errorMessage = typedAction.error?.message || typedAction.payload?.message;''
    // if (errorMessage?.includes("ERR_CONNECTION_REFUSED") || errorMessage?.includes("Network Error")) {
    //   console.warn("Connection refused – logging out...");
    //   store.getState().dispatch(resetAuthState());
    //   store.getState().dispatch(resetDisplayState());
    //   store.getState().dispatch(resetPropertyState());
    //   store.getState().dispatch(logoutThunk());
    //   router.navigate("/"); // Go back to login page
    //   return;
    // }

    
    
    // Handle the specific case of a first-time login redirect error.
    //  This middleware checks for a specific error condition (statusCode 303 and name "RedirectError").
    //  This condition indicates that the user is logged in, but needs to set their password.
    //  The middleware dispatches an action (updateFirstLogin) to update the Redux store,
    //  and then uses the router.navigate function to redirect the user to the password setup page.
    if (statusCode === 303 && name === 'RedirectError' && isFirstLogin) {
      store.dispatch(updateFirstLogin(isFirstLogin));
      const path = getErrorPath(statusCode);
      if (path) router.navigate(path); 
    }
  
  }

  return next(action);
};