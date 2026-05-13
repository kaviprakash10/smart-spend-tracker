import Joi from "joi";

export const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required(),
  });
  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

export const validateEmailOTP = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(data);
};

export const validatePhoneOTP = (data) => {
  const schema = Joi.object({
    phone: Joi.string(),
    email: Joi.string().email(),
  }).or("phone", "email");
  return schema.validate(data);
};
