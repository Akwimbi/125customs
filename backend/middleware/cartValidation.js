// Middleware for validating cart request bodies using Joi
const Joi = require('joi');

const idSchema = Joi.number().integer().positive();

const baseItemSchema = {
  productId: idSchema.required(),
  quantity: idSchema.min(1).default(1),
  unitPrice: Joi.number().positive().precision(2),
  customizationDetails: Joi.any(),
  selectedOptions: Joi.array().items(Joi.string())
};

const itemSchema = Joi.object(baseItemSchema).unknown(true);

const itemsArraySchema = Joi.array().items(itemSchema).min(1).required();

const addItemSchema = Joi.object({
  productId: idSchema.required(),
  quantity: idSchema.min(1).default(1),
  customizationDetails: Joi.any(),
  selectedOptions: Joi.array().items(Joi.string())
});

const updateItemSchema = Joi.object({
  quantity: idSchema.min(1).required()
});

const syncCartSchema = Joi.object({
  items: itemsArraySchema
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
  validateAddItem: validate(addItemSchema),
  validateUpdateItem: validate(updateItemSchema),
  validateSyncCart: validate(syncCartSchema)
};