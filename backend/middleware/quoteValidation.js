// Middleware for validating quote request bodies using Joi
const Joi = require('joi');

const idSchema = Joi.number().integer().positive();
const stringReq = Joi.string().required();
const stringOpt = Joi.string().allow('').optional();
const emailSchema = Joi.string().email().required();
const phoneSchema = Joi.string().pattern(/^[+\d\s()-]+$/).required(); // simple phone validation
const positiveInt = Joi.number().integer().positive();
const positiveNumber = Joi.number().positive().precision(2);

// Create quote schema
const createQuoteSchema = Joi.object({
  companyName: stringReq,
  contactPerson: stringReq,
  email: emailSchema,
  phone: phoneSchema,
  projectDescription: stringOpt,
  quantity: positiveInt.required(),
  materialPreference: stringOpt,
  serializationType: stringOpt,
  serializationData: stringOpt
});

// Quote item schema
const quoteItemSchema = Joi.object({
  productId: positiveInt.required(),
  quantity: positiveInt.required(),
  unitPrice: positiveNumber.required()
});

// Approve quote schema
const approveQuoteSchema = Joi.object({
  totalAmount: positiveNumber.required(),
  notes: stringOpt
});

// Reject quote schema
const rejectQuoteSchema = Joi.object({
  reason: Joi.string().required()
});

/**
 * Validation middleware factory
 * @param {Joi.ObjectSchema} schema - Joi schema to validate against
 * @returns {function} Express middleware
 */
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const details = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details
      });
    }
    next();
  };
}

module.exports = {
  validateCreateQuote: validate(createQuoteSchema),
  validateQuoteItem: validate(quoteItemSchema),
  validateApproveQuote: validate(approveQuoteSchema),
  validateRejectQuote: validate(rejectQuoteSchema)
};
