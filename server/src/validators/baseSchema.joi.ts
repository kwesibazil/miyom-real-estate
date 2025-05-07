import Joi from 'joi';


//Base schemas
const stringSchema = Joi.string().required().messages({
  'string.base': '{#label} must be a string',
  'string.empty': '{#label} cannot be empty',
  'any.required': '{#label} is required'
})


const numberSchema = Joi.number().min(0).required().messages({
  'any.required': '{#label} is required',
  'any.empty': '{#label} cannot be empty',
  'number.base': '{#label} must be a number',
  'number.min': 'Number must be at least {#limit}' 
})



const emailSchema = Joi.string().email().required().messages({
  'string.email': 'email must be a valid email',
  'any.required': 'email is required',
  'string.empty': 'email cannot be empty',
})


const addressSchema =  Joi.object({
  city: stringSchema,
  state: stringSchema,
  street: stringSchema,
  zipCode: stringSchema,
  country: Joi.string().trim().required().default('USA'),
}).required()


const propertyTypeSchema = Joi.string().trim().required().valid('industrial', 'commercial', 'residential')



//just send the id and have the service look it up
const userDetailsSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  _id: Joi.string().trim().required(),
  profileImgUrl: Joi.string().trim().required(),
  firstName:  Joi.string().trim().required(),
  lastName:  Joi.string().trim().required(),
}).required()



const propertyStatusSchema = Joi.string().trim().required().valid('completed', 'under construction', 'awaiting inspection')


export default {userDetailsSchema, stringSchema, numberSchema, emailSchema, propertyTypeSchema, propertyStatusSchema, addressSchema};

