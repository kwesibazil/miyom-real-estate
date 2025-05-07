import mongoose from 'mongoose';

import PropertyModel from "../models/property.model";
import {generateDescription} from '../helpers/property.helper'
import { generateSequentialAccountNo, convertStringToObjectType } from "../helpers/general.helpers";

import CustomError from "../errors/customError.errors";
import { BadRequestError, ForbiddenError, ConflictError,  InternalServerError, NotFoundError} from "../errors/errors.error";


import {type User } from "../types/user.interfaces";
import {type UploadResource } from '../types/general.interface';
import { type Property, type CreateProperty } from '../types/property.interface';


/**
 * Creates a new property in the database.
 *
 *  This function performs the following steps:
 *  Generates a sequential account number for the property.
 *  Converts the provided `userId` to a Mongoose ObjectId.
 *  Generates a description for the property if one is not provided in the payload.
 *  Populates the `investorId` field of the newly created property with selected investor data.
 *  Returns the newly created and populated property object.
 *
 * @param userId The ID of the user creating the property.
 * @param payload The data for the new property, conforming frontend and validated by joi.
 * 
 * @controller - createProperty
 * @throws {BadRequestError} If the input data is invalid or missing.
 * @throws {ConflictError} If a property with the same title already exists.
 * @throws {InternalServerError} If an unexpected error occurs during the process.
 */
const createNewProperty = async (userId:string | mongoose.Types.ObjectId, payload:CreateProperty) => {
  try {
    const accountNo = await generateSequentialAccountNo({attr: 'property', letter:'P'});
    const createdBy = await convertStringToObjectType(userId);
    
    const {generateDesc, addressString} = generateDescription(payload);
    const title = addressString;
    const investor = payload.investorId
    const submittedDescription =  payload.description
    const description  = submittedDescription ? submittedDescription : generateDesc
    const propertyData = {investor, title, accountNo, description, createdBy, ...payload };

    const newProperty = new PropertyModel(propertyData)
    const property =  await newProperty.save();

    if(!property) throw new BadRequestError('failed to create property');

    const populatedProperty = await PropertyModel.findById(property.id)
    .select('-createdAt -updatedAt -__v')
    .populate({
      path: 'investor',
      select: '_id email firstName lastName telephone profileImgUrl'
    })

    return populatedProperty
      
  } catch (error:any) {

    if(error.name === 'MongoServerError' && error.code === 11000)
      throw new ConflictError('This Property already exists. Please choose a different title and try again')

    if (error instanceof mongoose.Error.ValidationError) 
      throw new BadRequestError(`Missing or Incorrect Data provided`);

    if (error instanceof CustomError) throw error;

    else throw new InternalServerError();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Fetches up to 300 property records from the database.
 * 
 * - Queries the `PropertyModel` collection for all documents.
 * - Limits the result to a maximum of 300 entries to prevent large payloads.
 * - Throws a `NotFoundError` if no properties are found.
 * 
 * @returns An array of property documents.
 * @throws NotFoundError if no properties exist in the database.
 */
const findAllProperty = async(user:User) => {
  try {
    if(user.userRole !== 'admin')throw new ForbiddenError();

    const properties = await PropertyModel.find({})
    .limit(300)
    .select('-createdAt -updatedAt -__v')
    .populate({
      path: 'investor',
      select: '_id email firstName lastName telephone profileImgUrl'
    });

    if(!properties || properties.length === 0) throw new NotFoundError();
    return properties;

  } catch (error:any) {    
    if (error instanceof CustomError) throw error;
    else throw new InternalServerError();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Finds properties associated with a given investor ID.
 *
 * This function retrieves a list of properties from the database that are associated with the
 * investor identified by the provided ID. It converts the ID to a Mongoose ObjectId if necessary,
 * limits the number of results, excludes certain fields, and populates the investor information.
 * It handles potential errors, such as no properties being found for the investor or a server
 * error occurring during the database query.
 *
 * @param id The ID of the investor to find properties for, which can be a string or a Mongoose ObjectId.
 * @returns A Promise that resolves to an array of property objects if found.
 * @throws {NotFoundError} If no properties are found for the given investor ID.
 * @throws {InternalServerError} If an unexpected error occurs during the database query.
 */
const findInvestorProperty = async(id: string | mongoose.Types.ObjectId) => {
  try {
    const paredId = await convertStringToObjectType(id);

    const properties = await PropertyModel.find({ investor: paredId })
      .limit(300)
      .select('-createdAt -updatedAt -__v')
      .populate({
        path: 'investor',
        select: '_id email firstName lastName telephone profileImgUrl'
      });

      if(!properties || properties.length === 0) throw new NotFoundError();
      return properties;
  } catch (error) {
    if (error instanceof CustomError) throw error;
    else throw new InternalServerError();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Updates a property by its ID.
 *
 * - Parses the property ID from the payload.
 * - Uses `findByIdAndUpdate` to update the property in the database.
 * - Throws a `NotFoundError` if the property with the given ID is not found.
 * - Generates a title and description for the property.
 * - Updates the property's title and description.
 * - Returns the updated property.
 * - Catches and handles errors, throwing appropriate custom errors.
 * 
 * @param payload - An object containing the property ID and the updated data.
 * @returns The updated property document.
 * @throws NotFoundError if the property is not found.
 * @throws InternalServerError for database or other unexpected errors.
 */
const updatePropertyById = async (payload:any) => {
  try {
    const{propertyId, updatedData} = payload;
    const parsedPropertyId = await convertStringToObjectType(propertyId);

    const property = await PropertyModel.findByIdAndUpdate(parsedPropertyId, updatedData, { new: true})
    
    if(!property) throw new NotFoundError();
    const populatedProperty = await property.populate({
      path: 'investor',
      select: '_id email firstName lastName telephone profileImgUrl'
    })

    const {generateDesc, addressString} = generateDescription(property);
    populatedProperty.title = addressString;
    populatedProperty.description = generateDesc;
    return  await populatedProperty.save()

  } catch (error:any) {
    if(error.name === 'MongoServerError' && error.code === 11000)
      throw new ConflictError('Property with this address already exists. Please verify address')

    if (error instanceof mongoose.Error.ValidationError) 
      throw new BadRequestError(`Missing or Incorrect Data provided`);
    
    if (error instanceof CustomError) throw error;
    else throw new InternalServerError();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Finds properties based on a search payload and type.
 *
 * - Validates that a payload is provided; throws `BadRequestError` if missing.
 * - If the `type` is `'id'`, converts the string to a MongoDB ObjectId and builds a query by `_id`.
 * - Otherwise, builds a case-insensitive regex query to search across multiple fields 
 *   (`title`, `accountNo`, and `address` subfields).
 * - Executes the query using `PropertyModel.find()`.
 * - Populates the `investor` field with selected user fields.
 * - Throws `NotFoundError` if no properties match the query.
 * - Returns the list of matching property documents.
 * - Catches and handles errors, rethrowing custom errors and wrapping others in `InternalServerError`.
 *
 * @param payload - The search string or property ID.
 * @param type - The search type: `'id'` for ID-based search, or any other string for keyword-based search.
 * @returns An array of matched property documents with populated investor info.
 * @throws BadRequestError if no search payload is provided.
 * @throws NotFoundError if no matching properties are found.
 * @throws InternalServerError for unexpected errors during the query process.
 */
const findProperty = async(payload:string, type:string) => {
  try {
    let searchQuery:any;
    if (!payload) throw new BadRequestError('No search query provided');


    if(type ==='id'){
      const parsedPropertyId = await convertStringToObjectType(payload)
      searchQuery = {_id: parsedPropertyId }
    }
    
    else{
      const regex = new RegExp(payload, 'i');
      searchQuery = {
        $or: [
          { title: { $regex: regex } },
          { accountNo: { $regex: regex } },
          { 'address.street': { $regex: regex } },
          { 'address.city': { $regex: regex } },
          { 'address.state': { $regex: regex } },
          { 'address.zipCode': { $regex: regex } },
        ],
      };
    }

    const properties = await PropertyModel.find(searchQuery).populate({
      path: 'investor',
      select: '_id email firstName lastName telephone profileImgUrl'
    });
    
    if (!properties || properties.length === 0) 
      throw new NotFoundError(`No property found matching "${searchQuery}"`);
    
    return properties;

  } catch (error) {
    if (error instanceof CustomError) throw error;
    else throw new InternalServerError();
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Saves uploaded file data (image, inspection, or legal documents) to a property's corresponding field.
 *
 * - Converts the provided property ID string into a MongoDB ObjectId.
 * - Finds the corresponding property document and populates its `investor` field with selected user info.
 * - Throws `NotFoundError` if the property does not exist.
 * - If no file data is provided in the payload, returns the found property as-is.
 * - Based on the `type` in the payload:
 *   - For `'image'`: Initializes `imagesUrl` if missing, then inserts image data at a specific index
 *     based on the `thumbnail` value (`primary`, `secondary`, `tertiary`, `fourth`), or appends by default.
 *   - For `'inspection'`: Initializes `inspectionReportsUrl` if missing and appends new data.
 *   - For `'legal'`: Initializes `legalDocumentsUrl` if missing and appends new data.
 * - Saves the updated property document to the database.
 * - Returns the updated property document.
 *
 * @param payload - An object containing the property ID, file data, file type, and optional thumbnail position.
 * @returns The updated property document after appending the uploaded file data.
 * @throws NotFoundError if no matching property is found by ID.
 */
const saveFileDataToDatabase = async(payload: UploadResource) => {
  try {
    const parsedPropertyId = await convertStringToObjectType(payload.id);

    const property: Property | null = await PropertyModel.findById(parsedPropertyId).populate({
      path: 'investor',
      select: '_id email firstName lastName telephone profileImgUrl'
    });


    if (!property) throw new NotFoundError('No property found');
    if(!payload.data) return property;

    
    if (payload.type === 'image') {
      if (!property.imagesUrl) property.imagesUrl = [];
      const indexMap = {primary: 0, secondary: 1, tertiary: 2, fourth: 3,};
      const insertIndex = payload.thumbnail ? indexMap[payload.thumbnail] ?? property.imagesUrl.length : property.imagesUrl.length;
      property.imagesUrl.splice(insertIndex, 0, ...payload.data);
    }

    else if (payload.type === 'inspection') {
      if (!property.inspectionReportsUrl) property.inspectionReportsUrl = [];
      property.inspectionReportsUrl.push(...payload.data);
    } 

    else if (payload.type === 'legal') {
      if (!property.legalDocumentsUrl) property.legalDocumentsUrl = [];
      property.legalDocumentsUrl.push(...payload.data);
    } 

    const updatedProperty = await property.save();
    return updatedProperty;

  } catch (error:any) {
    if (error instanceof CustomError) throw error;
    else throw new InternalServerError();
  }
}


export default {saveFileDataToDatabase, createNewProperty,findAllProperty, findInvestorProperty, updatePropertyById, findProperty}