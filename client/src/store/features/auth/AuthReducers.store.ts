import { type AuthState } from "@store/features/auth/authStore.interface";
import { type PayloadAction } from '@reduxjs/toolkit';


const resetAuthState =  (state: AuthState) => {
  state.user = null;
  state.status = null;
  state.isLoggedIn = false;
}

const updateFirstLogin = (state: AuthState,  action: PayloadAction<boolean>) => {
  state.isFirstLogin = action.payload;
  state.isLoggedIn = true
}



export default {resetAuthState, updateFirstLogin};