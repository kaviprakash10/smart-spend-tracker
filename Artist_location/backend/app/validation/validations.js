import Joi from "joi";

// Register Validation
const UserRegisterValidationSchema = Joi.object({
  userName: Joi.string().trim().min(3).max(30).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "any.required": "Username is required",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
  }),

  password: Joi.string()
    .trim()
    .min(8)
    .max(128)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase, one lowercase, one number, and one special character",
      "string.empty": "Password is required",
    }),

  role: Joi.string().valid("artist", "fan").messages({
    "any.only": "Role must be either artist or fan",
  }),
});

// Login Validation
const UserloginValidationSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().trim().min(8).max(128).required(),
});

export { UserRegisterValidationSchema, UserloginValidationSchema };
// user updated validation
const UpdateRoleSchema = Joi.object({
  role: Joi.string().valid("admin", "artist", "fan").required(),
});

export { UpdateRoleSchema };
