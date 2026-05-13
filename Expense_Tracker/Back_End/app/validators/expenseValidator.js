import Joi from "joi";

export const validateExpense = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    amount: Joi.number().positive().required(),
    category: Joi.string().required(),
    date: Joi.date(),
    description: Joi.string().allow("", null),
  });
  return schema.validate(data);
};
