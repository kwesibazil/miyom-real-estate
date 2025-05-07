import { createAsyncThunk} from '@reduxjs/toolkit';
import { delay} from '@helpers/utils.helpers';
import axiosInstance from '@config/axios.config';
import { ServerErrorResponse } from '../auth/authStore.interface';
import * as PropTypes from '@store/features/property/propertyStore.interface';



/**
 * Fetches property data for a specific investor based on their email.
 * server returns max 300 property records from the database.
 * 
 * @param {string} email - The email address of the investor.
 * 
 * 
 * @note server has limit max 300 records
 * @returns An object containing:
 *  - data: an array of Property objects,
 *  - message: A human-readable response message,
 */
export const fetchInvestorProperties = createAsyncThunk <PropTypes.PropertyResponse, string, {rejectValue: ServerErrorResponse}>
('property/fetchInvestorProperties', async (id, { rejectWithValue }) => {
  try {    
    const res = await axiosInstance.get(`/property/investor/${id}`);
    return res.data;
  } catch (error: any) { 
    return rejectWithValue(error.serverErrorResponse); 
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Asynchronously creates a new property.
 * @returns new array with property data.
 *
 * @remarks
 * - links investorId to property
 * - Sends POST to 'property/create'.
 * - Returns data on success.
 * - Returns error on failure.
 * - Extra reducers use general function for rejected action.
 */
export const createPropertyThunk = createAsyncThunk <PropTypes.PropertyResponse, PropTypes.CreatePropertyPayload, {rejectValue: ServerErrorResponse}>
('property/create', async (propertyDetails, { rejectWithValue }) => {
  try {
    await delay()
    const res = await axiosInstance.post('property/create', propertyDetails);
    return res.data;
  } catch (error: any) { 
    return rejectWithValue(error.serverErrorResponse); 
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Asynchronously updates a property by its ID.
 *
 * @param propertyDetails -  ID and data.
 * @returns Updated property data in an array.
 *
 * @remarks
 * - Returns data on success.
 * - Returns error on failure.
 * - Extra reducers use generalPropertyUpdate
 */
export const updatePropertyByIdThunk = createAsyncThunk <PropTypes.PropertyResponse, PropTypes.UpdatePropertyPayload, {rejectValue: ServerErrorResponse}>
('property/updatePropertyById', async (propertyDetails, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put('property/update', propertyDetails);
    return res.data;
  } catch (error: any) { 
    return rejectWithValue(error.serverErrorResponse); 
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Uploads a property file (e.g.,  "image" | "legal" | 'inspection") to the server.
 * 
 * - Sends a `POST` request to the `property/upload` endpoint with a `FormData` payload.
 * - Sets the appropriate `Content-Type` header for multipart file upload.
 * 
 * @returns An object containing:
 *  - data: A single Property or an array of Property objects,
 *  - message: A human-readable response message,
 */
export const uploadPropertyFile = createAsyncThunk <PropTypes.PropertyResponse, PropTypes.UploadPropertyFileInput, {rejectValue: ServerErrorResponse}>
('property/uploadPropertyFile', async ({ files, propertyId, uploadType, thumbnail }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    
    for (const file of files) 
      formData.append('upload', file);

    formData.append('propertyId', propertyId);
    formData.append('uploadType', uploadType);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    const res = await axiosInstance.post('property/upload', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    
    return res.data;
  } catch (error: any) { 
    return rejectWithValue(error.serverErrorResponse); 
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *  fetches a property by its ID.

 * @remarks
 * - This function sends a GET request to the `/property/id/:_id` endpoint.
 * - The result is returned to the component that dispatches this thunk.
 * 
 * @returns An object containing:
 *  - data: an array of Property objects (every res-endpoint wraps results in an array called data[]),
 *  - message: A human-readable response message,
 */
export const getPropertyByIdThunk = createAsyncThunk <PropTypes.PropertyResponse, string, {rejectValue: ServerErrorResponse}>
('property/getPropertyById', async (propertyId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/property/id/${propertyId}`);
    return res.data;
  } catch (error: any) { 
    return rejectWithValue(error.serverErrorResponse); 
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *  fetches all the investor  properties .

 * @remarks
 * - This function sends a GET request to the `/property/properties/:_id` endpoint.
 * - The result is returned to the component that dispatches this thunk.
 * 
 * @returns An object containing:
 *  - data: A single Property or an array of Property objects,
 *  - message: A human-readable response message,
 */
export const getInvestorPropertiesThunk = createAsyncThunk <PropTypes.PropertyResponse, string, {rejectValue: ServerErrorResponse}>
('property/getInvestorPropertyIdThunk', async (investorId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/property/properties/${investorId}`);
    return res.data;
  } catch (error: any) { 
    return rejectWithValue(error.serverErrorResponse); 
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// interface SearchPayload {
//   search: string;
// }

// export const getPropertyBySearchThunk = createAsyncThunk <PropTypes.PropertyResponse, SearchPayload, {rejectValue: PropTypes.ServerPropertyErrorResponse}>
// ('property/getPropertyBySearch', async (SearchPayload, { rejectWithValue }) => {
//   try {
//     console.log('getPropertyBySearch thunk');
//     await delay()
//     const res = await axiosInstance.get(`/property/title/${SearchPayload.search}`);
//     return res.data;
//   } catch (error: any) { 
//     return rejectWithValue(error.serverErrorResponse); 
//   }
// })