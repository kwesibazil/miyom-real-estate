import { createSlice} from "@reduxjs/toolkit";

import { type RootState } from "@store/store";
import { type AuthState, type Investor} from "@store/features/auth/authStore.interface";

import reducers from './AuthReducers.store';
import handleExtraReducers from "./AuthExtraReducer.store";





// const propertyStatusMessages: Message[] = [
//   {
//     _id: "1",
//     content: "1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA status updated to Awaiting Inspection.",
//     subject: "Property Status Update",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
//   {
//     _id: "2",
//     content: "1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA is now marked as Inspection Completed.",
//     subject: "Property Status Update",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
//   {
//     _id: "3",
//     content: "Status of 1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA changed to Under Construction.",
//     subject: "Property Status Update",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
//   {
//     _id: "4",
//     content: "1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA status updated to Available for Sale.",
//     subject: "Property Status Update",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
//   {
//     _id: "5",
//     content: "1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA status changed to Under Offer.",
//     subject: "Property Status Update",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
//   {
//     _id: "6",
//     content: "1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA is now marked as Sold.",
//     subject: "Property Status Update",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
//   {
//     _id: "7",
//     content: "Status of 1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA updated to Rented.",
//     subject: "Property Status Update",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
//   {
//     _id: "8",
//     content: "1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA status changed to On Hold.",
//     subject: "Property Status Update",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
//   {
//     _id: "9",
//     content: "New inspection scheduled for 1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA.",
//     subject: "Inspection Update",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
//   {
//     _id: "10",
//     content: "Inspection date updated for 1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA.",
//     subject: "Inspection Update",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
//     {
//     _id: "11",
//     content: "New task assigned to 1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA.",
//     subject: "Task Update",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
//   {
//     _id: "12",
//     content: "Task completed for 1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA.",
//     subject: "Task Update",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
//   {
//     _id: "13",
//     content: "Price updated for 1249 Ocean Avenue Apt 1A, Brooklyn, NY, 11230, USA.",
//     subject: "Price Change",
//     sent: new Date().toISOString(),
//     viewed: false,
//   },
// ];







const initialState: AuthState = {
  user: null,
  status: null,
  messages:  null,
  investors: null,
  isLoggedIn: false,
  isFirstLogin: false,
}


const authSlice = createSlice({
  name: 'auth', 
  initialState,
  reducers: {
    resetAuthState: reducers.resetAuthState,
    updateFirstLogin: reducers.updateFirstLogin,
  },
  extraReducers: handleExtraReducers
})


export default authSlice.reducer;

//selectors
export const selectUser = (state: RootState) => state.auth?.user ?? undefined;
export const selectIsLoggedIn = (state: RootState) => state.auth?.isLoggedIn ?? false;
export const selectAuthStatus = (state: RootState) => state.auth?.status ?? null;
export const selectFirstLogin = (state: RootState) => state.auth?.isFirstLogin?? false;

export const selectInvestorDetails = (state:RootState, investorId:string) => state.auth?.investors?.find((investor:Investor) => investor._id === investorId) ?? undefined;
export const selectInvestor = (state:RootState) => state.auth?.investors;
export const selectMessages = (state:RootState) => state.auth?.messages

//actions
export const { resetAuthState, updateFirstLogin } = authSlice.actions;
