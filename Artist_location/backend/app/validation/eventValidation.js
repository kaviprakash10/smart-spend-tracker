import Joi from "joi";

const EventValidationSchema = Joi.object({
  artist: Joi.string().required(),
  venueName: Joi.string().trim().min(3).required(),
  address: Joi.string().trim().min(5).required(),
  eventDate: Joi.date().greater("now").required(),
  totalPerson: Joi.number().min(1).required(),
});

export { EventValidationSchema };
