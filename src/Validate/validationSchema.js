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
  email: Joi.string().email().trim(),

  username: Joi.string().alphanum().min(3).max(30).trim(),

  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
})
  .xor('email', 'username')
  .messages({
    'object.missing': 'Email or Username is required',
    'object.xor': 'Only one of Email or Username should be provided',
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
