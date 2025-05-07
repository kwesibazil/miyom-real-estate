import { type ActionReducerMapBuilder, type PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import type {Investor, AuthState, User, ServerErrorResponse, InvestorResponse} from '@store/features/auth/authStore.interface';
import  * as Thunks  from './AuthThunk.store';




export type ReducerSuccess = (
  state: AuthState,
  action: PayloadAction<InvestorResponse>
) => void;




/**
 * Reducer function to handle successful login actions and upload profile image.
 * @param state - The current authentication state.
 * @param action - The action object containing the user data.
 *
 * @remarks
 * - Sets the login status to true.
 * - Sets the status to 'success'.
 * - Stores the user data in the state.
 * - Sets the isFirstLogin flag based on the user's passwordMustChange property.
 *
 * @returns void
 */
const loginFulfilled = (state: AuthState, action: PayloadAction<User>) => {
  state.isLoggedIn = true;
  state.status = 'success';
  state.user = action.payload;
  state.isFirstLogin = action.payload.passwordMustChange  
};



/**
 * Reducer function to handle login rejection.
 *
 * @description
 * This reducer is called when a login attempt fails (e.g., due to an incorrect password).
 * It updates the authentication state based on the error information provided in the action's payload.
 *
 * -  It sets the 'status' to 'failed' to indicate that the login was unsuccessful.
 * -  It checks if the error has a statusCode of 303 and a name of "RedirectError".
 * -  If this condition is true, it means the user has successfully authenticated
 * (their credentials are correct), but it's their first time logging in and they need to set their password.
 * In this case, it sets 'isLoggedIn' to true.
 * -  If the condition is false (it's a different type of login error, like invalid credentials),
 * it sets 'isLoggedIn' to false.
 *
 * @note
 * The reason 'isLoggedIn' is set to true in the 303 case is to allow the application to proceed
 * to the password setup step.  The global middleware (errorMiddleware) then detects this 303
 * status and redirects the user to the appropriate page to set their password.
 */
const loginRejected =  (state: AuthState, action:PayloadAction<ServerErrorResponse | undefined>) => { 
  state.status = 'failed';
  sessionStorage.clear();
  const { statusCode, name } = action.payload || {};
  
  if(statusCode === 303 && name ==="RedirectError")state.isLoggedIn = true;
  else state.isLoggedIn = false;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Reducer function to handle successful investor registration and updates.
 *
 * @description
 * This reducer is called when an request to fetch all  or update an investor is successful. 
 * It specifically manages the `investors` array within the state.
 *
 * - It sets the 'status' to 'success'.
 * - It extracts the investor user data from the action payload.
 * - It checks if the 'investors' array in the state already exists.
 * - If it exists, it checks if the investor is already in the array.
 * - If the investor is found, it updates the user's information in the array.
 * - If the investor is not found, it adds the new investor to the array.
 * - If the 'investors' array does not exist, it creates a new array with the registered user.
 */
const insertInvestorArray:ReducerSuccess = (state, action)  => {
  state.status = 'success';
  const result:Investor[] =   action.payload.data;

  if (state.investors) {
    result.forEach(newInvestor => {
      const existingIndex = state.investors!.findIndex(i => i._id === newInvestor._id);
      if (existingIndex > -1) state.investors![existingIndex] = newInvestor;
      else state.investors!.push(newInvestor);
    });
  } 

  else state.investors = [...result];
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const logoutFulfilled = (state: AuthState) => {
  state.status = 'success'
  state.user = null;
  state.investors = [];
  state.isLoggedIn = false;
  state.isFirstLogin = true;
  sessionStorage.clear();
}

const logoutRejected = (state: AuthState) => {
  state.user = null;
  state.investors = [];
  state.status = 'failed'
  state.isLoggedIn = false;
  state.isFirstLogin = true;
  sessionStorage.clear();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////








/**
 * Handles the rejection of a property update operation.
 *
 * This reducer sets the status to 'failed'
 */
const generalRejected =  (state:AuthState) => {
  state.status = 'failed';
}



const handleExtraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(Thunks.loginThunk.fulfilled, loginFulfilled)
    .addCase(Thunks.loginThunk.rejected, loginRejected)

    .addCase(Thunks.uploadProfileImageThunk.fulfilled, loginFulfilled)
    .addCase(Thunks.uploadProfileImageThunk.rejected, generalRejected)

    .addCase(Thunks.updatePasswordThunk.fulfilled, loginFulfilled)
    .addCase(Thunks.updatePasswordThunk.rejected, generalRejected)

    .addCase(Thunks.setPasswordThunk.fulfilled, loginFulfilled)
    .addCase(Thunks.setPasswordThunk.rejected, generalRejected)

    // 👆 updates login status and user object 


    .addCase(Thunks.logoutThunk.fulfilled, logoutFulfilled )
    .addCase(Thunks.logoutThunk.rejected, logoutRejected )

     // 👆 reset redux and session 


    .addCase(Thunks.FetchInvestorsThunk.fulfilled, insertInvestorArray )
    .addCase(Thunks.FetchInvestorsThunk.rejected,  generalRejected)

    .addCase(Thunks.NewInvestorThunk.fulfilled, insertInvestorArray)
    .addCase(Thunks.NewInvestorThunk.rejected, generalRejected)

    .addCase(Thunks.updateInvestorThunk.fulfilled, insertInvestorArray )
    .addCase(Thunks.updateInvestorThunk.rejected, generalRejected )

    // 👆 add a new investor 


    .addMatcher(
      isAnyOf(
        Thunks.loginThunk.pending,
        Thunks.logoutThunk.pending, 
        Thunks.NewInvestorThunk.pending,
        Thunks.updateInvestorThunk.pending,
        Thunks.FetchInvestorsThunk.pending,
        Thunks.updatePasswordThunk.pending,
        Thunks.setPasswordThunk.pending,
        Thunks.uploadProfileImageThunk.pending,
      ),
      state => {
        state.status = 'pending'; 
      }
    );
};


export default handleExtraReducers;
