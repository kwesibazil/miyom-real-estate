import Joi from 'joi';
import schema from './baseSchema.joi';


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^<>{}]{8,30}$/;
const pattern = new RegExp(passwordRegex);


const PasswordSchema = Joi.string().trim().min(8).max(30).regex(pattern).required().messages({
  'string.max': 'Password length must be less than or equal to {{#limit}} characters long',
  'string.min': 'Password length must be at least {{#limit}} characters long',
  'string.empty': 'Password is not allowed to be empty',
  "any.required": "Password is required!",
  'string.pattern.base': 'Your password contains invalid characters. Please use only letters, numbers, and allowed special characters ( @, #, or $.)',
})



const registerUserSchema = Joi.object({
  email: schema.emailSchema,
  firstName: schema.stringSchema,
  lastName: schema.stringSchema,
  telephone:  Joi.string().optional().trim().allow(''),
})



const loginUserSchema = Joi.object({
  email: schema.emailSchema,
  password: PasswordSchema,
})


const forgotPasswordSchema = Joi.object({
  email: schema.emailSchema,
})


const resetPasswordSchema = Joi.object({
  password: PasswordSchema,
})


const updatePassword = Joi.object({
  newPassword: PasswordSchema,
  currentPassword: PasswordSchema,
})



const UpdateInvestorDataSchema = Joi.object({
  email: schema.emailSchema,
  firstName: schema.stringSchema,
  lastName: schema.stringSchema,
  telephone:  Joi.string().optional().trim().allow(''),
});


const UpdateInvestorSchema = Joi.object({
  investorId:  Joi.string().hex().length(24).required(),
  updatedData: UpdateInvestorDataSchema
})


const investorIdParamsSchema = Joi.object({
  investorId: Joi.string().hex().length(24).required()
});

const propertyIdParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});

const propertyTitleParamsSchema = Joi.object({
  search: Joi.string().hex().length(24).required()
});


export default  {
  updatePassword,
  loginUserSchema, 
  registerUserSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  UpdateInvestorSchema,
  investorIdParamsSchema,
  propertyIdParamsSchema,
  propertyTitleParamsSchema
}