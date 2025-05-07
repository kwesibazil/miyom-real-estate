import cloudinary from 'cloudinary';
import {ConfigureError } from '../errors/errors.error'


if (!process.env.CLOUDINARY_CLOUD_NAME) 
  throw new ConfigureError('cloudinary cloud name env is missing.');

if (!process.env.CLOUDINARY_API_KEY) 
  throw new ConfigureError('cloudinary api key env is missing.');

if (!process.env.CLOUDINARY_API_SECRET) 
  throw new ConfigureError('cloudinary api secret env is missing.');



cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export default cloudinary.v2;