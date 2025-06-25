import Joi from 'joi';

export const registrationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must be at most 30 characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string()
    .email()
    .pattern(/@gmail\.com$/, 'gmail domain')
    .required()
    .messages({
      'string.email': 'Invalid email',
      'string.pattern.name': 'Only Gmail emails are allowed',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .min(6)
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/\d/, 'number')
    .pattern(/[\W_]/, 'special')
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.pattern.name': 'Password must include {#name} character',
      'any.required': 'Password is required',
    }),
});

export const loginSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
});
export const activationSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Activation token is required',
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email',
    'any.required': 'Email is required',
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/\d/, 'number')
    .pattern(/[\W_]/, 'special')
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.pattern.name': 'Password must include {#name} character',
      'any.required': 'Password is required',
    }),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  newPassword: Joi.string()
    .min(6)
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/\d/, 'number')
    .pattern(/[\W_]/, 'special')
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.pattern.name': 'Password must include {#name} character',
      'any.required': 'New password is required',
    }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).optional().messages({
    'string.empty': 'Category name cannot be empty',
  }),
});

export const productSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().allow(''),
  price: Joi.number().positive().required(),
  category: Joi.string().required(),
  stock: Joi.number().integer().min(0).default(0),
});
