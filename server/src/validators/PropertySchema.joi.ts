import Joi from 'joi';
import schema from './baseSchema.joi';



const createPropertySchema = Joi.object({
  type: schema.propertyTypeSchema,
  status: schema.propertyStatusSchema,
  address:schema.addressSchema,
  amountInvested: schema.numberSchema,
  startDate: Joi.string().trim().optional(), 
  endDate: Joi.string().trim().optional(),  
  investmentRate: schema.numberSchema,
  completedSoFar: schema.numberSchema,
  investorId:Joi.string().trim().min(1)
});




const UpdateDataSchema = Joi.object({
  endDate: Joi.string().trim().optional().allow(''),
  startDate:Joi.string().trim().optional().allow(''),
  type: Joi.string().trim().valid('industrial', 'commercial', 'residential').optional().allow(''),
  amountInvested: Joi.number().min(0).optional(),
  completedSoFar: Joi.number().min(0).max(100).optional(),
  investor:  Joi.string().trim().required(),
  investmentRate: Joi.number().min(0).max(100).optional(),
  status: Joi.string().trim().optional().valid('completed', 'under construction', 'awaiting inspection'),
  address: Joi.object({
    city: Joi.string().trim().optional(),
    state: Joi.string().trim().optional(),
    street: Joi.string().trim().optional(),
    zipCode: Joi.string().trim().optional(),
    country: Joi.string().trim().optional(),
  }),
});





const UpdatePropertySchema = Joi.object({
  propertyId: Joi.string().hex().length(24).required(),
  updatedData: UpdateDataSchema
})



const searchByIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const searchByStringSchema = Joi.object({
  search: Joi.string().trim().min(1).required(),
});



const uploadPropertyResourceSchema = Joi.object({
  propertyId:  Joi.string().hex().length(24).required(),
  thumbnail: Joi.string().trim().optional(),
  uploadType: Joi.string().optional().trim().valid('inspection', 'image', 'legal')           
})


export default {uploadPropertyResourceSchema, createPropertySchema, searchByIdSchema, searchByStringSchema, UpdatePropertySchema}