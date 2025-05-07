import { createAsyncThunk} from '@reduxjs/toolkit';
import { delay } from '@helpers/utils.helpers';
import axiosInstance from '@config/axios.config';

import * as PropTypes  from '@store/features/auth/authStore.interface';



/**
 * Asynchronously logs in a user.
 * @returns {Promise<PropTypes.User>} - The user data upon successful login.
 *
 * @remarks
 * - Sends a POST request to 'user/login' with the provided credentials.
 * - Uses a 500ms delay.
 * - Returns user data on success.
 * - Returns server error on failure.
 */
export const loginThunk = createAsyncThunk <PropTypes.User, PropTypes.LoginPayload, {rejectValue: PropTypes.ServerErrorResponse}>
('user/login', async (credential, { rejectWithValue }) => {
  try {
    await delay(500)
    const res = await axiosInstance.post('user/login', credential);
    return res.data;
  } catch (error: any) { 
    return rejectWithValue(error.serverErrorResponse); 
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Asynchronously registers a new user.
 * @returns {Promise<PropTypes.User>} - The user data upon successful registration.
 *
 * @remarks
 * - Sends a POST request to 'user/register' with the user payload.
 * - Returns investor data on success. (also returns array)
 * - Returns server error on failure.
 */
export const NewInvestorThunk = createAsyncThunk <PropTypes.InvestorResponse, PropTypes.CreateUserPayload, {rejectValue: PropTypes.ServerErrorResponse}>
('user/newInvestorThunk', async (payload, {rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('user/register', payload);
    return res.data;
  } catch (error: any) { 
    return rejectWithValue(error.serverErrorResponse); 
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const logoutThunk = createAsyncThunk< void, void,  {rejectValue: PropTypes.ServerErrorResponse}>
('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.post('user/logout');
    return
  } catch (error:any) {
    return rejectWithValue(error.serverErrorResponse); 
  }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Asynchronously fetch all investors.
 *
 * @remarks
 * - admin only routes
 * - Sends a GET request to 'user/investors'
 * - Returns investor data on success.
 * - Returns server error on failure.
 */

export const FetchInvestorsThunk = createAsyncThunk <PropTypes.InvestorResponse, string, {rejectValue: PropTypes.ServerErrorResponse}>
('user/fetchAllInvestors', async (id, {rejectWithValue }) => {
  try { 
    const res = await axiosInstance.get(`user/investor/${id}`);
    return res.data;
  } catch (error: any) { 
    return rejectWithValue(error.serverErrorResponse); 
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Asynchronously update a investor.
 * @returns The user data upon successful update.
 *
 * @remarks
 * - Sends a POST request to 'user/update' with the user payload.
 * - Returns user data on success.  (also returns array)
 * - Returns server error on failure.
 */
export const updateInvestorThunk = createAsyncThunk <PropTypes.InvestorResponse, PropTypes.UpdateInvestorPayload, {rejectValue: PropTypes.ServerErrorResponse}>
('user/updateInvestor', async (payload, {rejectWithValue }) => {
  try {
    const res = await axiosInstance.put('user/update', payload);
    return res.data;
  } catch (error: any) { 
    return rejectWithValue(error.serverErrorResponse); 
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Asynchronous Redux Thunk to upload a user's profile image.
 *
 * This thunk is responsible for handling the asynchronous operation of uploading a
 * profile image file to the server. It prepares a `FormData` object containing the
 * image file and sends a POST request to the 'user/profile-image' endpoint.
 *
 * Upon a successful server response, the thunk returns the user data received from
 * the server. If an error occurs during the API call, it extracts the server error
 * response from the error object and uses `rejectWithValue` to propagate this error
 * to the Redux store, allowing components to handle the failure appropriately.
 *
 * @param profileImag The `File` object representing the profile image to be uploaded.
 * @param {rejectValue: PropTypes.ServerErrorResponse} An object containing the `rejectValue` type for error handling.
 * @returns A Promise that resolves to the updated `PropTypes.User` object upon successful upload.
 * If the upload fails, it returns a rejected promise with the `PropTypes.ServerErrorResponse`.
 */
export const uploadProfileImageThunk = createAsyncThunk<PropTypes.User, File,  {rejectValue: PropTypes.ServerErrorResponse}>
('user/profile-image', async(profileImag, {rejectWithValue}) => {
  try {

    const formData = new FormData();
    formData.append('image',profileImag);

    const res = await axiosInstance.put('user/profile-image',
      formData,
      {headers: {'Content-Type': 'multipart/form-data'}}
    );  
    return res.data;
  } catch (error:any) {
    return rejectWithValue(error.serverErrorResponse); 
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Asynchronous Redux Thunk to update a user's password.
 *
 * This thunk handles the asynchronous operation of sending a request to the server
 * to update the user's password. It takes a payload containing the necessary
 * password information and sends a POST request to the 'user/update-password' endpoint.
 *
 * Upon a successful server response, the thunk returns the updated user data received
 * from the server. If an error occurs during the API call, it extracts the server
 * error response from the error object and uses `rejectWithValue` to propagate this
 * error to the Redux store, allowing components to handle the password update failure.
 *
 * @param {PropTypes.UpdatePasswordPayload} payload - An object containing the current
 * and new password information required for the update.
 */
export const updatePasswordThunk = createAsyncThunk<PropTypes.User, PropTypes.UpdatePasswordPayload,  {rejectValue: PropTypes.ServerErrorResponse}>
('user/update-password', async(payload, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.put('user/update-password', payload);
    return res.data;
  } catch (error:any) {
    return rejectWithValue(error.serverErrorResponse); 
  }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Asynchronous Redux Thunk to handle first time user login and update user's password.
 *
 * This thunk handles the asynchronous operation of sending a request to the server
 * to update the user's password. It takes a payload containing the necessary
 * password information and sends a POST request to the 'user/update-password' endpoint.
 *
 * Upon a successful server response, the thunk returns the updated user data received
 * from the server. If an error occurs during the API call, it extracts the server
 * error response from the error object and uses `rejectWithValue` to propagate this
 * error to the Redux store, allowing components to handle the password update failure.
 *
 * @param {PropTypes.UpdatePasswordPayload} payload - An object containing the current
 * and new password information required for the update.
 */
export const setPasswordThunk = createAsyncThunk<PropTypes.User, PropTypes.UpdatePasswordPayload,  {rejectValue: PropTypes.ServerErrorResponse}>
('user/set-password', async(payload, {rejectWithValue}) => {
  try {
    const res = await axiosInstance.post('user/set-password', payload);
    return res.data;
  } catch (error:any) {
    return rejectWithValue(error.serverErrorResponse); 
  }
})







export const forgotPasswordThunk = createAsyncThunk<PropTypes.ServerSuccessResponse, string,  {rejectValue: PropTypes.ServerErrorResponse}>
('user/forgot-password', async(email, {rejectWithValue}) => {
  try {
    await delay(500);
    const res = await axiosInstance.post('user/forgot-password', {email: email});
    return res.data;
  } catch (error:any) {
    return rejectWithValue(error.serverErrorResponse); 
  }
})


interface RestPasswordProp {
  password: string;
  token:string;
}

export const resetPasswordThunk = createAsyncThunk<PropTypes.ServerSuccessResponse, RestPasswordProp,  {rejectValue: PropTypes.ServerErrorResponse}>
('user/reset-password', async(payload, {rejectWithValue}) => {
  try {
    await delay();
    const res = await axiosInstance.post('user/reset-password',{password: payload.password }, {
      headers:{ 'Authorization': `Bearer ${payload.token}`}
    });
    return res.data;
  } catch (error:any) {
    return rejectWithValue(error.serverErrorResponse); 
  }
})


