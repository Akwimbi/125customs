// backend/middleware/paystackValidation.js
const Joi = require('joi');

/**
 * Schema for initializing payment
 * Expected body: { email, amount, callbackUrl, metadata?: { phone?, ... } }
 */
const initializePaymentSchema = Joi.object({
  email: Joi.string().email().required(),
  amount: Joi.number().positive().required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be greater than zero'
  }),
  callbackUrl: Joi.string().uri().required(),
  metadata: Joi.object({
    phone: Joi.string().optional(),
    // allow any other metadata fields
  }).optional()
});

/**
 * Schema for verifying payment (params)
 */
const verifyPaymentSchema = Joi.object({
  reference: Joi.string().required()
});

/**
 * Middleware factory for validation
 * @param {Joi.Schema} schema - Joi schema to validate against
 * @returns {function} Express middleware
 */
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body || req.params || req.query, { abortEarly: false });
    if (error) {
      const details = error.details.map(detail => detail.message);
      return res.status(400).json({ success: false, error: 'Validation failed', details });
    }
    next();
  };
}

module.exports = {
  validateInitializePayment: validate(initializePaymentSchema),
  validateVerifyPayment: validate(verifyPaymentSchema)
};