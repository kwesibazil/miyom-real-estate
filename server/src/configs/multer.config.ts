import multer from 'multer';
import { Request } from 'express';
import { UnauthorizedError } from '../errors/errors.error';


const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',  
  'application/vnd.ms-powerpoint',      
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];


const storage = multer.memoryStorage(); 
const maxSizeImage = 50 * 1024 * 1024              //50mb



const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new UnauthorizedError(`${file.mimetype} is not allowed`);
    return callback(error); // Pass the error to the callback
  }
  callback(null, true); // Accept the file
};



export const upload = multer({
  storage, 
  fileFilter, 
  limits: {fileSize: maxSizeImage}
})



