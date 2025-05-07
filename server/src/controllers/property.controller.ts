import {StatusCodes} from 'http-status-codes';
import type { Request, Response } from "express";

import {type User } from "../types/user.interfaces";
import {type FileUpload} from '../types/general.interface';

import logger from '../configs/logger.config';


import propertyService from  '../services/property.service';
import { UnprocessableError } from '../errors/errors.error';
import PropertySchemaJoi from '../validators/PropertySchema.joi';
import { uploadImageToCloudinary } from "../helpers/general.helpers";

import { DownloadFile } from '../types/general.interface';

import { UnauthorizedError } from '../errors/errors.error';


/**
 *  Creates a new property.
 * 
 *  @access PRIVATE
 *  @route  POST /api/property/create
 *  @return {PropertyResponse} 
 *  @errors - errors are thrown by the service and caught by the global error handler
 * 
 * @note since Property model only stores the investor id
 *        populate needs to be ran to fetch the data necessary for
 *        PropertyResponse - (check User inference for Investor definition)
*/
const createProperty = async(req:Request, res:Response) => {
  const user: User = req.user as User;
  if (!user || (user && user.userRole !== 'admin')) throw new UnauthorizedError();

  const property = await propertyService.createNewProperty(user.id, req.body);

  const propertyResponse = {
    data:[property],
    message: "successfully created"
  }
  res.status(StatusCodes.CREATED).json(propertyResponse)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *  find all property.
 * 
 *  @access PRIVATE
 *  @route  GET /api/property/
 *  @return {PropertyResponse} 
 *  @errors - errors are thrown by the service and caught by the global error handler
 * 
 * @note since Property model only stores the investor id
 *        populate needs to be ran to fetch the data necessary for
 *        PropertyResponse - (check User inference for Investor definition)
*/
const findAllProperty = async (req:Request, res:Response) => {
  const user = req.user as User;
  if (!user || (user && user.userRole !== 'admin')) throw new UnauthorizedError();

  const foundProperty = await propertyService.findAllProperty(user);
  
  const result= {
    data: foundProperty, 
    message: "data found"
  }
  res.status(StatusCodes.OK).json(result)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Retrieves property data based on the user's role.
 *  
 * - If the user is an admin, fetches all properties.
 * - Otherwise, fetches only properties associated with the user's id.
 * 
 * @access PRIVATE
*  @route  GET /api/property/
*  @return {PropertyResponse} 
 * @note Constructs a standardized response containing:
 * - `data`: The list of properties
 * - `message`: Status message indicating success.
 */
const findAllInvestorPropertyAdmin = async(req:Request, res:Response) => {
  const user = req.user as User;
  
  let foundProperties:any;

  if(user.userRole === 'admin')
    foundProperties =  await propertyService.findAllProperty(user);
  else{
    const investorId =   req.params.investorId || user.id 
    foundProperties = await propertyService.findInvestorProperty(investorId);
  }

  const result = {
    data: foundProperties, 
    message:"data found"
  }

  res.status(StatusCodes.OK).json(result);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Updates an existing property.
 * 
 * - If the user is an admin, Updates an existing property.
 * - Otherwise, Throws this error UnauthorizedError 
 * 
 * @access PRIVATE
*  @route  GET /api/property/
*  @return {PropertyResponse} 
 * @note Constructs a standardized response containing:
 * - `data`: The list of properties
 * - `message`: Status message indicating success.
 * 
 * * @throws Custom or InternalServerError from the `updatePropertyById` service.
 */
const updateProperty = async(req:Request, res:Response) => {
  const user: User = req.user as User;
  if (!user || (user && user.userRole !== 'admin')) throw new UnauthorizedError();

  const property = await propertyService.updatePropertyById(req.body);

  const result = {
    data: [property],
    message: "updated successful"
  }

  const propertyLog = JSON.stringify({
    user: `User ${user.firstName} ${user.lastName} - ${user.email} |  [${user.id}]`,
    subject: 'Change Property Data',
    propertyID:req.body.propertyId,
    date: Date.now()
  })
  
  logger.propertyLogger.error(propertyLog);   //👈 save log message to file
  
  res.status(StatusCodes.OK).json(result);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Controller for searching a property by string or ID.
 *
 * - Validates that the user is authenticated and has the 'admin' role.
 * - Extracts `id` or `search` from the request parameters.
 * - Determines the type of search: by ID or general string.
 * - Calls the `findProperty` service with the appropriate payload and type.
 * - Wraps the result in a response object and sends it with a 200 OK status.
 * 
 * @returns JSON response with the found property data.
 * @throws UnauthorizedError if the user is not authenticated or not an admin.
 * @throws Custom or InternalServerError from the `findProperty` service.
 */
const findPropertyByStringOrId = async(req:Request, res:Response) => {
  const user: User = req.user as User;
  if (!user || (user && user.userRole !== 'admin')) throw new UnauthorizedError();

  const { id, search } = req.params;
  const type = id ? 'id' : 'search';
  const payload = id ?? search;

  const foundProperty = await propertyService.findProperty(payload, type);
  
  const result = {
    data: foundProperty,
    message: "data found"
  }

  res.status(StatusCodes.OK).json(result);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Handles uploading of property-related resources (e.g. images, inspection reports, legal documents).
 *
 * - Validates that file(s) are present in the request; returns a 400 error if not.
 * - Extracts `thumbnail`, `propertyId`, and `uploadType` from the request body.
 * - Uploads all provided files to Cloudinary in parallel using `uploadImageToCloudinary()`.
 * - Maps Cloudinary responses and original file metadata into a uniform `FileUpload` array.
 * - Calls `saveFileDataToDatabase()` to associate the uploaded file URLs with the appropriate property record,
 *   based on the provided `uploadType` and optional `thumbnail` placement.
 * - Returns the updated property document and success message in a 200 response.
 *
 * @param req - Express request object, expected to contain file uploads and relevant fields in the body.
 * @param res - Express response object used to return status and JSON result.
 * @returns Sends a JSON response containing the updated property and a success message.
 */

const uploadPropertyResource = async(req:Request, res:Response) => {
  const user: User = req.user as User;
  if (!user || (user && user.userRole !== 'admin')) throw new UnauthorizedError();

  if (!req.files || !Array.isArray(req.files) || !(req.files as Express.Multer.File[]).length) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: 'no image file provided from server' });
  }
  
  else{
    const { error } = PropertySchemaJoi.uploadPropertyResourceSchema.validate(req.body, { abortEarly: true });
    if (error) throw new UnprocessableError(error.message);

    let uploadData:DownloadFile[] | FileUpload[];
    const {thumbnail, propertyId, uploadType}  = req.body;


    const uploadedFiles = await Promise.all(
      (req.files as Express.Multer.File[]).map((file: Express.Multer.File) => {
        return uploadImageToCloudinary(file)
      })
    );

    
    if(uploadType !== 'image'){
      uploadData = uploadedFiles.flat().map((data, index): DownloadFile => ({
        url: data.url,
        sizeInBytes: data.bytes,
        mime: data.format,
        uploadedAt: data.created_at,
        secureUrl: data.secure_url,
        uploadedBy: `${user.firstName} ${user.lastName}`,
        filename: (req.files as Express.Multer.File[])[index].originalname,
      }))
    }
    else{
      uploadData = uploadedFiles.flat().map((data,index):FileUpload => ({
        url: data.url,
        mime: data.format,
        secureUrl: data.secure_url,
        filename: (req.files as Express.Multer.File[])[index].originalname,
      }))
    }

    const property = await propertyService.saveFileDataToDatabase({
      data: uploadData, 
      id: propertyId, 
      type: uploadType,
      thumbnail: thumbnail
    });

    const result = {
      data: [property],
      message: "upload success"
    }

    res.status(StatusCodes.OK).json(result);
  }
} 

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Retrieves property data based on the user's role.
 *  
 * - fetches only properties associated with the user's id.
 * 
 * @note
 * - does the exact same thing as findAllInvestorProperty
 * - but am too lazy and tired to add a flag to check if admin 
 *  wants all the properties or just a single one
 * 
 * @access PRIVATE
*  @route  GET /api/property/
*  @return {PropertyResponse} 
 * @note Constructs a standardized response containing:
 * - `data`: The list of properties
 * - `message`: Status message indicating success.
 */
const findAllInvestorsProperty = async(req:Request, res:Response) => {
  const user: User = req.user as User;
  if (!user || (user && user.userRole !== 'admin')) 
    throw new UnauthorizedError();

  const { investorId} = req.params;
  const foundProperty = await propertyService.findInvestorProperty(investorId);
  
  const result = {
    data: foundProperty,
    message: "data found"
  }
  res.status(StatusCodes.OK).json(result);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default {findAllInvestorsProperty, uploadPropertyResource, createProperty, findAllProperty, findAllInvestorPropertyAdmin, updateProperty, findPropertyByStringOrId}